import { pushDataLayer } from "./dataLayer";

export type CustomizationErrorCode =
  | "missing_option"
  | "missing_print_side"
  | "missing_logo"
  | "logo_storage_full"
  | "other";

export type CustomizationEventName =
  | "customize_start"
  | "customize_logo_upload"
  | "customize_error"
  | "customize_mockup_download";

export function trackCustomizationEvent(
  eventName: CustomizationEventName,
  params: {
    item_group_id: string;
    file_type?: string;
    error_code?: CustomizationErrorCode;
  },
): void {
  const productId = params.item_group_id.trim();
  if (!productId) return;

  pushDataLayer({
    event: eventName,
    item_group_id: productId,
    ...(params.file_type ? { file_type: params.file_type } : {}),
    ...(params.error_code ? { error_code: params.error_code } : {}),
  });
}
