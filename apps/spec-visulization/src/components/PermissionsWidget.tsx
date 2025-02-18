import { WidgetProps } from "@rjsf/utils";
import { Checkbox, TooltipHost } from "@fluentui/react";

/**
 * A custom widget for rendering permission arrays as a group of checkboxes
 * @param props - The widget props from react-jsonschema-form
 */
const PermissionsWidget = (props: WidgetProps) => {
  const { schema, value = [], onChange } = props;

  // Get all possible permissions from the schema

  const options = (schema.items as any)!.oneOf.map((option: any) => ({
    value: option.const,
    label: option.title,
    description: option.description,
  }));

  const handleChange = (permissionValue: string) => {
    const newValue = value.includes(permissionValue)
      ? value.filter((v: string) => v !== permissionValue)
      : [...value, permissionValue];
    onChange(newValue);
  };

  return (
    <div className="flex-col gap-2 grid grid-cols-2">
      {options.map((option: any) => (
        <TooltipHost
          key={option.value}
          content={option.description}
          // Delay showing the tooltip for a better UX
          calloutProps={{ gapSpace: 0 }}
        >
          <div className="inline-block">
            <Checkbox
              label={option.label}
              checked={value.includes(option.value)}
              onChange={() => handleChange(option.value)}
            />
          </div>
        </TooltipHost>
      ))}
    </div>
  );
};

export default PermissionsWidget;
