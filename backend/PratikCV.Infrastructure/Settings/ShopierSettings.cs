namespace PratikCV.Infrastructure.Settings
{
    public class ShopierSettings
    {
        public string ApiKey { get; set; } = string.Empty;
        public string WebhookSecret { get; set; } = string.Empty;
        public string BaseUrl { get; set; } = "https://api.shopier.com";
    }
}
