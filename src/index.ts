import * as crypto from 'crypto';
import * as moment from 'moment-timezone';
import fetch from 'node-fetch';

export class PayooModule {
    private username: string;
    private shopId: string;
    private shopTitle: string;
    private checksumKey: string;
    private endpointCheckout: string;
    private shopDomain: string;
    private endpointRefund: string;
    private apiUsername: string;
    private apiUserpassword: string;
    private apiSignature: string;

    constructor({
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
    }
    ) {
        this.username = username;
        this.shopId = shopId;
        this.shopTitle = shopTitle;
        this.checksumKey = checksumKey;
        this.endpointCheckout = endpointCheckout;
        this.shopDomain = shopDomain;
        this.endpointRefund = endpointRefund;
        this.apiUsername = apiUsername;
        this.apiUserpassword = apiUserpassword;
        this.apiSignature = apiSignature;
    }

    async createOrderRequest({ orderId, orderNumber, amount, returnUrl, notifyUrl }) {
        const reqData = {
            data: this.createOrderXml({ orderId, orderNumber, returnUrl, amount, notifyUrl }),
            checksum: this.createSHA512(this.checksumKey + this.createOrderXml({ orderId, orderNumber, returnUrl, amount, notifyUrl })),
            refer: this.shopDomain,
            // payment_group: 'CC,Bank-account',
        };
        try {
            const result = await fetch(this.endpointCheckout, {
                method: 'POST',
                body: JSON.stringify(reqData),
            });

            return result.json();
        } catch (err) {
            console.log('payoo err', err);
        }
    }

    createOrderXml({ orderId, returnUrl, orderNumber, amount, notifyUrl }) {
        return (
            '<shops>' +
            '<shop>' +
            `<username>${this.username}</username>` +
            `<shop_id>${this.shopId}</shop_id>` +
            `<session>${orderId}</session>` +
            `<shop_title>${this.shopTitle}</shop_title>` +
            `<shop_domain>${this.shopDomain}</shop_domain>` +
            `<shop_back_url>${encodeURIComponent(returnUrl)}</shop_back_url>` +
            `<order_no>${orderNumber}</order_no>` +
            `<order_cash_amount>${amount}</order_cash_amount>` +
            `<order_ship_date>${moment()
                .add(3, 'days')
                .format('DD/MM/YYYY')}</order_ship_date>` +
            '<order_ship_days>3</order_ship_days>' +
            `<order_description>${encodeURIComponent(
                `Thanh toan cho hoa don so ${orderNumber}  gia tri ${amount}`,
            )}</order_description>` +
            `<validity_time>${this.getDateValidity()}</validity_time>` +
            `<JsonResponse>TRUE</JsonResponse>` +
            `<notify_url>${notifyUrl}</notify_url>` +
            '</shop>' +
            '</shops>'
        );
    }

    createSHA512(text: string): string {
        const hash = crypto.createHash('sha512');
        //passing the data to be hashed
        const data = hash.update(text);
        //Creating the hash in the required format
        return data.digest('hex');
    }

    getDateValidity() {
        return moment()
            .add(1, 'hours')
            .format('yyyyMMDDHHmmss'); //Request will get invalid after 1 hours
    }
    async verifyNotifyData({ ip, xml }) {
        try {
            const data = JSON.parse(Buffer.from(xml, 'base64').toString());
            const result = JSON.parse(data.ResponseData);
            const checksum = await this.createSHA512(this.checksumKey + data.ResponseData + ip);
            // check signature
            if (checksum.toUpperCase() !== data.Signature.toUpperCase()) {
                throw new Error('The signature is incorrect.');
            }
            return result;
        } catch (err) {
            throw new Error('This order already paid.');
        }
    }

    async verifyPayment({ status, session, order_no, checksum, totalAmount, paymentFee }) {
        const checksumValue = await this.createSHA512(this.checksumKey + session + '.' + order_no + '.' + status);
        if (checksum !== checksumValue) {
            throw new Error('The signature is incorrect.');
        }

        if (status !== '1') {
            throw new Error('The transaction was not completed.');
        }

        return {
            status,
            session,
            order_no,
            checksum,
            totalAmount,
            paymentFee,
        };
    }

    async refundPayment({ OrderNo, PurchaseDate, Money, Description }) {
        const requestData = {
            OrderNo,
            Money,
            Description,
            ActionType: 2,
            PurchaseDate: PurchaseDate.substring(0, 8),
        };

        const checksumValue = await this.createSHA512(
            this.checksumKey +
            `{"OrderNo":"${OrderNo}","Money":${Money},"Description":"${Description}","ActionType":2,"PurchaseDate":"${PurchaseDate.substring(0, 8)}"}`,
        );
        const res = await fetch(this.endpointRefund, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                APIUsername: this.apiUsername,
                APIPassword: this.apiUserpassword,
                APISignature: this.apiSignature,
            },
            body: JSON.stringify({
                RequestData: JSON.stringify(requestData),
                Signature: checksumValue,
            }),
        });

        const result = await res.json();
        return JSON.parse(result.ResponseData);
    }
}
