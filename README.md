# API Payoo Payment Gateway

The plugin will make it easier to integrate Payoo payments.

## Process flow
![Flow](https://raw.githubusercontent.com/pamt0504/payoo-payment-gateway/master/process-flow.png)

## Installation
The first, Payoo partner must be successfully registered.
Use the package manager [npm](https://www.npmjs.com/) to install.

```bash
npm i payoo-payment-gateway
```

## Usage
```typescript
import { PayooPayment } from 'payoo-payment-gateway';


/* HOST_WEBHOOK => Partner API. Used by Payoo to submit payment results by IPN method (server-to-server) method */
const HOST_WEBHOOK = process.env.HOST_WEBHOOK;

/* constructor: username, shopId, shopTitle, checksumKey, endpointCheckout, shopDomain, endpointRefund, apiUsername, apiUserpassword, apiSignature => provided by Payoo*/
/*  endpointCheckout:
      sandbox:  https://newsandbox.payoo.com.vn
      live:     https://www.payoo.vn
    endpointRefund:
      sandbox:  https://biz-sb.payoo.vn/BusinessRestAPI.svc
      live:     https://biz.payoo.vn/BusinessRestAPI.svc */

class PayooPaymentService {
    constructor(username, shopId, shopTitle, checksumKey, endpointCheckout, shopDomain, endpointRefund, apiUsername, apiUserpassword, apiSignature) {
      this.payooPayment = new PayooPayment({
        username,
        shopId,
        shopTitle,
        checksumKey,
        endpointCheckout,
        shopDomain,
        endpointRefund,
        apiUsername,
        apiUserpassword,
        apiSignature,
      })
    };

/* The payment method payUrl is returned  */
  async createPayment({
    orderId,
    orderNumber,
    amount,
    returnUrl = 'https://your-website.com',
  }) {
    try {
      const result = await this.payooPayment.createOrderRequest({
        orderId,
        orderNumber,
        amount,
        returnUrl,
        notifyUrl: HOST_WEBHOOK,
      });
      return result;
    } catch (error) {
      console.error(error)
      throw error;
    }
  }
  
/* Proceed the refund payment */
  async refundPayment({ OrderNo, PurchaseDate, Money, Description }) {
    try {
      const result = await this.payooPayment.refundPayment({
        OrderNo,
        Money,
        Description,
        PurchaseDate,
      });
      return result;
    } catch (error) {
      console.error(error)
      throw error;
    }
  }

/* The function for verify webhook request and payment */
/* Get IP in headers 'x-forwarded-for' */

  verifyNotifyData({ ip, xml }) {
    try {
      const result = this.payooPayment.verifyNotifyData({ ip, xml });
      return result;
    } catch (error) {
      console.error(error)
      throw error;
    }
  }

  verifyPayment({ status, session, order_no, checksum, totalAmount, paymentFee }){
    try {
      const result = this.payooPayment.verifyPayment({status, session, order_no, checksum, totalAmount, paymentFee })
      return result;
    } catch (error) {
      console.error(error)
      throw error;
    }
  }
}
```

## Contributing
Pull requests are welcome

## Important
Mail:  thao.pamt@gmail.com
Skype: phamanmaithao10@gmail.com
Documentation: (https://github.com/pamt0504/payoo-payment-gateway/blob/master/HD%20Tich%20Hop%20Thanh%20Toan%20Payoo_Js_v2.pdf)

## License
[MIT](https://choosealicense.com/licenses/mit/)
                           