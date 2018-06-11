const CONF = {
	port: "5009",
	rootPathname: "/article",

	// 微信小程序 App ID
	appId: "wx1465f9a62bfea385",

	// 微信小程序 App Secret
	appSecret: "",

	// 是否使用腾讯云代理登录小程序
	useQcloudLogin: true,

	/**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
	 * pass: "dev88481989",
     */
	mysql: {
		host: "localhost",
		port: 3306,
		user: "root",
		db: "diary",
		pass: "root",
		char: "utf8mb4"
	},

	cos: {
		/**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
		region: "ap-shanghai",
		// Bucket 名称
		fileBucket: "qcloudtest",
		// 文件夹
		uploadFolder: ""
	},
	serverHost: "https://taflgi5t.qcloud.la",
	tunnelServerUrl: "https://taflgi5t.qcloud.la",
	tunnelSignatureKey: "27fb7d1c161b7ca52d73cce0f1d833f9f5b5ec89",
	// 腾讯云相关配置可以查看云 API 秘钥控制台：https://console.cloud.tencent.com/capi
	qcloudAppId: "1256808148",
	qcloudSecretId: "AKIDWxFyY9Yv54c5NWkQ91nOp4BNPF2fNZDq",
	qcloudSecretKey: "cGk4CE7ymU5Xpiy99yd8at6B7seNH9rT",


	// 微信登录态有效期
	wxLoginExpires: 7200,
	wxMessageToken: "weixinmsgtoken"
};

module.exports = CONF;
