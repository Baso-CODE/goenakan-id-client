import { PublicAppSettings } from "@/app/api/app-setting/getAppSettings.api";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";

type TrackingScriptsProps = {
  settings: PublicAppSettings;
};

export default function TrackingScripts({ settings }: TrackingScriptsProps) {
  const useGtm = settings.gtmEnabled && Boolean(settings.gtmId);

  const useDirectGoogleAnalytics =
    !useGtm &&
    settings.googleAnalyticsEnabled &&
    Boolean(settings.googleAnalyticsId);

  const useDirectGoogleAds =
    !useGtm && settings.googleAdsEnabled && Boolean(settings.googleAdsId);

  const useMetaPixel = settings.pixelEnabled && Boolean(settings.pixelId);

  const useMicrosoftClarity =
    settings.microsoftClarityEnabled && Boolean(settings.microsoftClarityId);

  return (
    <>
      {useGtm && settings.gtmId && <GoogleTagManager gtmId={settings.gtmId} />}

      {useDirectGoogleAnalytics && settings.googleAnalyticsId && (
        <GoogleAnalytics gaId={settings.googleAnalyticsId} />
      )}

      {useDirectGoogleAds && settings.googleAdsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAdsId}`}
            strategy="afterInteractive"
          />

          <Script id="google-ads" strategy="afterInteractive">
            {`
                window.dataLayer =
                  window.dataLayer || [];

                function gtag(){
                  dataLayer.push(arguments);
                }

                gtag('js', new Date());

                gtag(
                  'config',
                  '${settings.googleAdsId}'
                );
              `}
          </Script>
        </>
      )}

      {useMetaPixel && settings.pixelId && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
                !function(f,b,e,v,n,t,s)
                {
                  if(f.fbq)return;

                  n=f.fbq=function(){
                    n.callMethod
                      ? n.callMethod.apply(
                          n,
                          arguments
                        )
                      : n.queue.push(
                          arguments
                        );
                  };

                  if(!f._fbq)f._fbq=n;

                  n.push=n;
                  n.loaded=!0;
                  n.version='2.0';
                  n.queue=[];

                  t=b.createElement(e);
                  t.async=!0;
                  t.src=v;

                  s=b.getElementsByTagName(e)[0];

                  s.parentNode.insertBefore(
                    t,
                    s
                  );
                }(
                  window,
                  document,
                  'script',
                  'https://connect.facebook.net/en_US/fbevents.js'
                );

                fbq(
                  'init',
                  '${settings.pixelId}'
                );

                fbq(
                  'track',
                  'PageView'
                );
              `}
          </Script>

          <noscript>
            <img
              height="1"
              width="1"
              style={{
                display: "none",
              }}
              src={`https://www.facebook.com/tr?id=${settings.pixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {useMicrosoftClarity && settings.microsoftClarityId && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){
                  (
                    c[a].q=c[a].q||[]
                  ).push(arguments);
                };

                t=l.createElement(r);
                t.async=1;

                t.src=
                  "https://www.clarity.ms/tag/"
                  +i;

                y=l.getElementsByTagName(r)[0];

                y.parentNode.insertBefore(
                  t,
                  y
                );
              })(
                window,
                document,
                "clarity",
                "script",
                "${settings.microsoftClarityId}"
              );
            `}
        </Script>
      )}
    </>
  );
}
