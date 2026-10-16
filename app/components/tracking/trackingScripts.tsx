import { PublicAppSettings } from "@/app/api/app-setting/getAppSettings.api";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";

type TrackingScriptsProps = {
  settings: PublicAppSettings;
};

export default function TrackingScripts({ settings }: TrackingScriptsProps) {
  const useGtm = settings.gtmEnabled && Boolean(settings.gtmId?.trim());

  const useGoogleAnalytics =
    settings.googleAnalyticsEnabled &&
    Boolean(settings.googleAnalyticsId?.trim());

  const useGoogleAds =
    settings.googleAdsEnabled && Boolean(settings.googleAdsId?.trim());

  const useMetaPixel =
    settings.pixelEnabled && Boolean(settings.pixelId?.trim());

  const useMicrosoftClarity =
    settings.microsoftClarityEnabled &&
    Boolean(settings.microsoftClarityId?.trim());

  const gtmId = settings.gtmId?.trim() || "";
  const gaId = settings.googleAnalyticsId?.trim() || "";
  const googleAdsId = settings.googleAdsId?.trim() || "";
  const pixelId = settings.pixelId?.trim() || "";
  const clarityId = settings.microsoftClarityId?.trim() || "";

  return (
    <>
      {useGtm && <GoogleTagManager gtmId={gtmId} />}

      {useGoogleAnalytics && <GoogleAnalytics gaId={gaId} />}

      {useGoogleAds && (
        <>
          {!useGoogleAnalytics && (
            <Script
              id="google-ads-gtag-loader"
              src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAdsId)}`}
              strategy="afterInteractive"
            />
          )}

          <Script id="google-ads-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              window.gtag = window.gtag || function() {
                window.dataLayer.push(arguments);
              };
              window.gtag('js', new Date());
              window.gtag('config', ${JSON.stringify(googleAdsId)});
            `}
          </Script>
        </>
      )}

      {useMetaPixel && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s) {
                if(f.fbq) return;
                n=f.fbq=function() {
                  n.callMethod
                    ? n.callMethod.apply(n,arguments)
                    : n.queue.push(arguments);
                };
                if(!f._fbq) f._fbq=n;
                n.push=n;
                n.loaded=!0;
                n.version='2.0';
                n.queue=[];
                t=b.createElement(e);
                t.async=!0;
                t.src=v;
                s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s);
              }(
                window,
                document,
                'script',
                'https://connect.facebook.net/en_US/fbevents.js'
              );

              fbq('init', ${JSON.stringify(pixelId)});
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${encodeURIComponent(pixelId)}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {useMicrosoftClarity && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y) {
              c[a]=c[a]||function() {
                (c[a].q=c[a].q||[]).push(arguments);
              };
              t=l.createElement(r);
              t.async=1;
              t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];
              y.parentNode.insertBefore(t,y);
            })(
              window,
              document,
              "clarity",
              "script",
              ${JSON.stringify(clarityId)}
            );
          `}
        </Script>
      )}
    </>
  );
}
