import { useCallback } from "react";
import { ErrorSchema, FieldProps, getUiOptions } from "@rjsf/utils";
import { getDefaultRegistry } from "@rjsf/core";

const {
  fields: { ObjectField },
} = getDefaultRegistry();

/**
 * CustomObjectField component that handles custom widget rendering based on uiSchema
 * @param props - FieldProps from react-jsonschema-form
 * @returns React component that renders either a custom widget or default ObjectField
 */
export function CustomObjectField(props: FieldProps) {
  const { onChange, uiSchema, registry } = props;

  const customWidgetName = uiSchema?.["ui:widget"];
  if (customWidgetName) {
    const CustomWidget = registry.widgets[customWidgetName as any] as any;
    return <CustomWidget {...props} onChange={onChange} />;
  }

  return <ObjectField {...props} onChange={onChange} />;
}
