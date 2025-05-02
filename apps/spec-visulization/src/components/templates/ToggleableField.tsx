"use client";
import { FieldProps } from "@rjsf/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * ToggleableField component that wraps a field and allows toggling its visibility
 * when the field is not required. If the field is required, it's always shown.
 * @param props - FieldProps from react-jsonschema-form
 * @returns React component that conditionally renders the field based on toggle state
 */
export const ToggleableField = (props: FieldProps) => {
  const { schema, name, required = false, idSchema, children } = props;
  const [isExpanded, setIsExpanded] = useState(required);
  const [fieldValue, setFieldValue] = useState<any>(props.formData);

  // If the field is required, always show it
  useEffect(() => {
    if (required) {
      setIsExpanded(true);
    }
  }, [required]);

  // Keep track of the field value even when hidden
  useEffect(() => {
    setFieldValue(props.formData);
  }, [props.formData]);

  const fieldTitle = schema.title || name;
  const fieldDescription = schema.description;
  const isOptional = !required;

  return (
    <div className="border border-gray-200 rounded-md my-3 overflow-hidden">
      <div
        className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 ${
          isExpanded ? "border-b border-gray-200" : ""
        }`}
        onClick={() => isOptional && setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{fieldTitle}</span>
            {isOptional && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                Optional
              </span>
            )}
          </div>
          {fieldDescription && (
            <p className="text-sm text-gray-500 mt-1">{fieldDescription}</p>
          )}
        </div>
        {isOptional && (
          <div className="text-gray-500">
            {isExpanded ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 py-3 bg-white"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToggleableField;
