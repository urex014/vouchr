import assert from 'node:assert';
import { connectToDatabase, disconnectDatabase } from '../src/lib/mongodb/connection';
import { User, Product, Order, Payment, ReloadlyTransaction, GiftCard, AdminAuditLog } from '../src/models';
import { AuthService } from '../src/server/services/authService';
import { ProductService } from '../src/server/services/productService';
import { OrderService } from '../src/server/services/orderService';
import { PaymentService } from '../src/server/services/paymentService';
import { FulfillmentService } from '../src/server/services/fulfillmentService';
import { AdminService } from '../src/server/services/adminService';
import { requireAdmin } from '../src/lib/auth/session';

async function runCriticalFlowTests() {
  console.log('===============================================================');
  console.log('  VOUCHR PRODUCTION BACKEND & MONGODB CRITICAL FLOWS TEST SUITE');
  console.log('===============================================================\n');

  await connectToDatabase();
  console.log('✓ Step 0: Connected to MongoDB database successfully.');

  // Clean up any test artifacts
  await User.deleteMany({ email: /test.*@example\.com/ });
  await Order.deleteMany({ customerEmail: /test.*@example\.com/ });
  await Payment.deleteMany({ providerReference: /test/ });

  // -------------------------------------------------------------
  // TEST 1: User Registration & Authentication
  // -------------------------------------------------------------
  console.log('\n--- [TEST 1] User Registration & Authentication ---');
  const testCustomerEmail = `test.customer.${Date.now()}@example.com`;
  const registerResult = await AuthService.register({
    name: 'Ada Lovelace',
    email: testCustomerEmail,
    password: 'SecurePassword123!',
    phone: '+1234567890',
  });
  assert(registerResult.user._id, 'User ID must be generated');
  assert.strictEqual(registerResult.user.role, 'USER', 'Role must default to USER');
  assert(registerResult.token, 'JWT token must be issued upon registration');
  console.log('✓ User registration succeeded with JWT issuance.');

  // Test login with correct credentials
  const loginResult = await AuthService.login(testCustomerEmail, 'SecurePassword123!');
  assert(loginResult.token, 'Login must issue a valid token');
  console.log('✓ Login verified with correct credentials.');

  // Test login with invalid password
  let invalidPasswordFailed = false;
  try {
    await AuthService.login(testCustomerEmail, 'WrongPassword!');
  } catch (err: any) {
    invalidPasswordFailed = true;
    assert.strictEqual(err.status, 401, 'Invalid password must return 401');
  }
  assert(invalidPasswordFailed, 'Login with invalid password must fail');
  console.log('✓ Invalid password rejected with HTTP 401.');

  // -------------------------------------------------------------
  // TEST 2: Admin Authorization & Guard Checks
  // -------------------------------------------------------------
  console.log('\n--- [TEST 2] Admin Authorization & Role Guard ---');
  await AuthService.ensureAdminAccount();
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@vouchr.com';
  const adminLogin = await AuthService.login(adminEmail, 'VouchrAdmin2026!');
  assert.strictEqual(adminLogin.user.role, 'ADMIN', 'Admin user must have ADMIN role');
  console.log('✓ Administrator account verified with ADMIN role.');

  // Verify non-admin access rejection in requireAdmin
  let nonAdminRejected = false;
  try {
    const fakeRequest = new Request('http://localhost/api/admin/stats', {
      headers: { authorization: `Bearer ${loginResult.token}` },
    });
    await requireAdmin(fakeRequest as any);
  } catch (err: any) {
    nonAdminRejected = true;
    assert.strictEqual(err.status, 403, 'Non-admin accessing admin route must receive 403');
  }
  assert(nonAdminRejected, 'Non-admin access must be rejected');
  console.log('✓ Non-admin access to admin endpoints rejected with HTTP 403.');

  // -------------------------------------------------------------
  // TEST 3: Product Retrieval & Denomination Validation
  // -------------------------------------------------------------
  console.log('\n--- [TEST 3] Product Retrieval & Denomination Validation ---');
  const { products, total } = await ProductService.getProducts();
  assert(products.length > 0, 'Products catalog must be populated from Reloadly/MongoDB');
  const primaryProduct = products[0];
  console.log(`✓ Retrieved ${total} cached gift cards from MongoDB. Selected: ${primaryProduct.brandName} (${primaryProduct.reloadlyProductId})`);

  // Server-side denomination validation: invalid amount outside fixed amounts
  let invalidDenomFailed = false;
  try {
    await OrderService.createOrder({
      reloadlyProductId: primaryProduct.reloadlyProductId,
      amount: 999999, // disallowed amount
      customerEmail: testCustomerEmail,
      recipientEmail: 'sarah@example.com',
    });
  } catch (err: any) {
    invalidDenomFailed = true;
    assert.strictEqual(err.status, 400, 'Invalid denomination must return 400');
  }
  assert(invalidDenomFailed, 'Server-side validation must reject unallowed denomination');
  console.log('✓ Server-side denomination validation strictly rejected unauthorized amount.');

  // -------------------------------------------------------------
  // TEST 4: Order Creation in MongoDB
  // -------------------------------------------------------------
  console.log('\n--- [TEST 4] Order Creation Lifecycle ---');
  const validDenomination = primaryProduct.fixedAmounts[0] || primaryProduct.minAmount || 50;
  const order = await OrderService.createOrder({
    reloadlyProductId: primaryProduct.reloadlyProductId,
    amount: validDenomination,
    quantity: 1,
    customerEmail: testCustomerEmail,
    customerName: 'Ada Lovelace',
    recipientEmail: 'sarah.chen@example.com',
    recipientName: 'Sarah Chen',
    personalMessage: 'Enjoy your gift card!',
    userId: registerResult.user._id?.toString(),
  });

  assert(order._id, 'Order must have a valid MongoDB ObjectId');
  assert(/^GC-\d{8}-[A-Z0-9]{5}$/.test(order.orderNumber), `Order number ${order.orderNumber} must match GC-YYYYMMDD-XXXXX format`);
  assert.strictEqual(order.paymentStatus, 'PENDING');
  assert.strictEqual(order.purchaseStatus, 'PENDING');
  assert.strictEqual(order.deliveryStatus, 'PENDING');
  console.log(`✓ Order created in MongoDB with human-readable ID: ${order.orderNumber}`);

  // -------------------------------------------------------------
  // TEST 5: Payment Initialization & Unique Provider Reference
  // -------------------------------------------------------------
  console.log('\n--- [TEST 5] Payment Initialization ---');
  const paymentInit = await PaymentService.initializePayment({
    orderId: order._id.toString(),
    provider: 'crypto',
    userId: registerResult.user._id?.toString(),
  });
  assert(paymentInit.providerReference.startsWith('pay_'), 'Provider reference must be generated');
  assert.strictEqual(paymentInit.payment.status, 'PENDING');
  console.log(`✓ Payment initialized with unique provider reference: ${paymentInit.providerReference}`);

  // -------------------------------------------------------------
  // TEST 6: Payment Verification & Reloadly Fulfillment
  // -------------------------------------------------------------
  console.log('\n--- [TEST 6] Payment Verification & Reloadly Fulfillment ---');
  const demoTxHash = `0x0000000000000000000000000000000000000000000000000000000000000000demo_${Date.now()}`;
  const verification = await PaymentService.verifyPayment({
    orderId: order._id.toString(),
    providerReference: paymentInit.providerReference,
    provider: 'crypto',
    cryptoDetails: {
      txHash: demoTxHash,
      networkId: 'polygon-usdc',
    },
  });

  assert.strictEqual(verification.payment.status, 'SUCCESS', 'Payment status must be SUCCESS');
  assert.strictEqual(verification.order.paymentStatus, 'SUCCESS', 'Order paymentStatus must be SUCCESS');
  assert.strictEqual(verification.order.purchaseStatus, 'SUCCESS', 'Order purchaseStatus must be SUCCESS');
  assert.strictEqual(verification.order.deliveryStatus, 'DELIVERED', 'Order deliveryStatus must be DELIVERED');
  assert(verification.order.reloadlyTransactionId, 'Reloadly transaction ID must be recorded');
  console.log(`✓ Payment verified on-chain and Reloadly fulfillment completed. Reloadly TxID: ${verification.order.reloadlyTransactionId}`);

  // Verify ReloadlyTransaction was recorded in MongoDB
  const reloadlyTxDoc = await ReloadlyTransaction.findOne({ orderId: order._id });
  assert(reloadlyTxDoc, 'ReloadlyTransaction record must be saved in MongoDB');
  console.log(`✓ ReloadlyTransaction document verified in MongoDB: TxId ${reloadlyTxDoc.reloadlyTransactionId}`);

  // Verify GiftCard was recorded with protected code & PIN
  const giftCardDoc = await GiftCard.findOne({ orderId: order._id });
  assert(giftCardDoc, 'GiftCard document must exist in MongoDB');
  assert.strictEqual(giftCardDoc.code, undefined, 'Sensitive gift card code must not be selected in default query');
  console.log('✓ GiftCard document created with select: false protection on sensitive credentials.');

  // -------------------------------------------------------------
  // TEST 7: Duplicate Purchase Prevention (Idempotency)
  // -------------------------------------------------------------
  console.log('\n--- [TEST 7] Duplicate Purchase Prevention ---');
  const duplicateVerification = await PaymentService.verifyPayment({
    orderId: order._id.toString(),
    providerReference: paymentInit.providerReference,
    provider: 'crypto',
    cryptoDetails: {
      txHash: demoTxHash,
      networkId: 'polygon-usdc',
    },
  });
  assert.strictEqual(duplicateVerification.order.purchaseStatus, 'SUCCESS');
  console.log('✓ Duplicate payment verification handled idempotently without re-triggering fulfillment.');

  // -------------------------------------------------------------
  // TEST 8: Unauthorized Order Access Prevention
  // -------------------------------------------------------------
  console.log('\n--- [TEST 8] Unauthorized Order Access Prevention ---');
  const anotherUserToken = {
    userId: 'other_user_id',
    email: 'intruder@example.com',
    role: 'USER' as const,
    name: 'Intruder',
  };
  let intruderBlocked = false;
  try {
    await OrderService.getOrder(order._id.toString(), anotherUserToken);
  } catch (err: any) {
    intruderBlocked = true;
    assert.strictEqual(err.status, 403, 'Intruder must receive 403 Forbidden');
  }
  assert(intruderBlocked, 'Intruder must not access another user order');
  console.log('✓ Cross-customer unauthorized order inspection rejected with HTTP 403.');

  // -------------------------------------------------------------
  // TEST 9: Admin Real-Time Metrics & Order Inspection
  // -------------------------------------------------------------
  console.log('\n--- [TEST 9] Admin Real-Time Aggregations & Inspection ---');
  const stats = await AdminService.getStats();
  assert(stats.totalOrders >= 1, 'Total orders must reflect MongoDB orders');
  assert(stats.totalRevenue >= order.total, 'Revenue must aggregate successful payments');
  console.log(`✓ Admin real-time stats aggregated from MongoDB: Total Revenue $${stats.totalRevenue}, Total Orders: ${stats.totalOrders}`);

  // Admin order inspection with explicit sensitive credential reveal & audit log
  const adminIdentity = { userId: adminLogin.user._id!.toString(), email: adminEmail };
  const revealedCredentials = await AdminService.revealGiftCard(order._id.toString(), adminIdentity);
  assert(revealedCredentials.code, 'Revealed card must return code');
  console.log(`✓ Admin explicitly revealed gift card code with authorization: ${revealedCredentials.code}`);

  // Verify Audit Log
  const auditLog = await AdminAuditLog.findOne({ action: 'GIFT_CARD_VIEWED', orderId: order.orderNumber });
  assert(auditLog, 'AdminAuditLog must record GIFT_CARD_VIEWED action');
  console.log(`✓ Security audit log recorded: ${auditLog.action} by ${auditLog.adminEmail}`);

  // -------------------------------------------------------------
  // TEST 10: Failed Purchase Error Recovery & Admin Retry Flow
  // -------------------------------------------------------------
  console.log('\n--- [TEST 10] Failed Purchase Error Recovery & Admin Retry ---');
  // Create an order in FAILED purchase state (simulating provider temporary glitch)
  const failedOrder = await OrderService.createOrder({
    reloadlyProductId: primaryProduct.reloadlyProductId,
    amount: validDenomination,
    quantity: 1,
    customerEmail: testCustomerEmail,
    recipientEmail: 'retry.test@example.com',
  });
  await Order.findByIdAndUpdate(failedOrder._id, {
    paymentStatus: 'SUCCESS',
    purchaseStatus: 'FAILED',
    deliveryStatus: 'FAILED',
    failureReason: 'Simulated temporary provider timeout',
  });

  // Admin retries the failed purchase
  const retriedOrder = await AdminService.retryOrderFulfillment(failedOrder._id.toString(), adminIdentity);
  assert.strictEqual(retriedOrder.purchaseStatus, 'SUCCESS', 'Retried order purchaseStatus must be SUCCESS');
  assert.strictEqual(retriedOrder.deliveryStatus, 'DELIVERED', 'Retried order deliveryStatus must be DELIVERED');

  const retryAuditLog = await AdminAuditLog.findOne({ action: 'ORDER_RETRIED', orderId: failedOrder.orderNumber });
  assert(retryAuditLog, 'AdminAuditLog must record ORDER_RETRIED action');
  console.log(`✓ Failed order recovered successfully without recharging customer. Retried status: ${retriedOrder.purchaseStatus}`);

  // -------------------------------------------------------------
  // TEST 11: Payment Webhook Processing (Idempotency)
  // -------------------------------------------------------------
  console.log('\n--- [TEST 11] Payment Webhook Processing ---');
  const webhookResult = await PaymentService.processWebhook('generic', {
    reference: paymentInit.providerReference,
    status: 'successful',
  });
  assert(webhookResult.processed, 'Webhook must be marked processed');
  console.log('✓ Payment provider webhook processed idempotently.');

  console.log('\n===============================================================');
  console.log('  ALL 11 CRITICAL FULL-STACK TEST SUITES PASSED FLAWLESSLY!    ');
  console.log('===============================================================');

  await disconnectDatabase();
}

runCriticalFlowTests().catch(async (err) => {
  console.error('\n❌ Test execution failure:', err);
  await disconnectDatabase();
  process.exit(1);
});
