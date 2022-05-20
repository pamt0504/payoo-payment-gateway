export declare class PayooModule {
    private username;
    private shopId;
    private shopTitle;
    private checksumKey;
    private endpointCheckout;
    private shopDomain;
    private endpointRefund;
    private apiUsername;
    private apiUserpassword;
    private apiSignature;
    constructor({ username, shopId, shopTitle, checksumKey, endpointCheckout, shopDomain, endpointRefund, apiUsername, apiUserpassword, apiSignature, }: {
        username: string;
        shopId: string;
        shopTitle: string;
        checksumKey: string;
        endpointCheckout: string;
        shopDomain: string;
        endpointRefund: string;
        apiUsername: string;
        apiUserpassword: string;
        apiSignature: string;
    });
    createOrderRequest({ orderId, orderNumber, amount, returnUrl, notifyUrl }: {
        orderId: string;
        orderNumber: string;
        amount: number;
        returnUrl: string;
        notifyUrl: string;
    }): Promise<any>;
    createOrderXml({ orderId, returnUrl, orderNumber, amount, notifyUrl }: {
        orderId: string;
        returnUrl: string;
        orderNumber: string;
        amount: number;
        notifyUrl: string;
    }): string;
    createSHA512(text: string): string;
    getDateValidity(): string;
    verifyNotifyData({ ip, xml }: {
        ip: string;
        xml: string;
    }): Promise<any>;
    verifyPayment({ status, session, order_no, checksum, totalAmount, paymentFee }: {
        status: string;
        session: string;
        order_no: string;
        checksum: string;
        totalAmount: any;
        paymentFee: any;
    }): Promise<{
        status: string;
        session: string;
        order_no: string;
        checksum: string;
        totalAmount: any;
        paymentFee: any;
    }>;
    refundPayment({ OrderNo, PurchaseDate, Money, Description }: {
        OrderNo: string;
        PurchaseDate: string;
        Money: number;
        Description: string;
    }): Promise<any>;
}
