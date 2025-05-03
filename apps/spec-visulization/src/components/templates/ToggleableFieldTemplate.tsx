"use client";
import { FieldTemplateProps } from "@rjsf/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * ToggleableFieldTemplate component that allows toggling visibility of non-required fields
 * @param props - FieldTemplateProps from react-jsonschema-form
 * @returns React component that conditionally renders the field based on toggle state
 */
const ToggleableFieldTemplate = (props: FieldTemplateProps) => {
  const {
    id,
    label,
    children,
    errors,
    help,
    description,
    hidden,
    required,
    classNames,
    style,
  } = props;

  const isTopLevel = id === "root";
  const [isExpanded, setIsExpanded] = useState(required || isTopLevel);

  // If field is required or top-level, always show it
  useEffect(() => {
    if (required || isTopLevel) {
      setIsExpanded(true);
    }
  }, [required, isTopLevel]);

  if (hidden) {
    return <div className="hidden">{children}</div>;
  }

  return (
    <LayoutGroup>
      <div
        className={`${classNames || ""} ${
          isTopLevel ? "bg-white" : "border border-gray-200 rounded-md"
        } my-3 overflow-hidden`}
        id={id}
        style={style}
      >
        <div
          className={`flex items-center px-4 py-3 ${
            !isTopLevel ? "cursor-pointer hover:bg-gray-50" : "bg-gray-50"
          } ${isExpanded ? "border-b border-gray-200" : ""} `}
          onClick={() => !required && !isTopLevel && setIsExpanded(!isExpanded)}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{label}</span>
              {!isTopLevel &&
                (required ? (
                  <span className="text-xs text-red-500 bg-red-100 px-2 py-0.5 rounded">
                    Required
                  </span>
                ) : (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    Optional
                  </span>
                ))}
            </div>
            <AnimatePresence initial={false}>
              {description && !isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: {
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      mass: 0.8,
                    },
                    opacity: {
                      duration: 0.3,
                      ease: [0.4, 0.0, 0.2, 1],
                    },
                  }}
                  style={{ overflow: "hidden" }}
                >
                  <p className="text-sm text-gray-500 mt-1">{description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {!required && !isTopLevel && (
            <div className="text-gray-500">
              <motion.div
                initial={false}
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <ChevronRight size={18} />
              </motion.div>
            </div>
          )}
        </div>

        <AnimatePresence initial={false} mode="sync">
          {(isExpanded || required || isTopLevel) && (
            <motion.div
              initial={
                isTopLevel
                  ? { height: "auto", opacity: 1 }
                  : { height: 0, opacity: 0, overflow: "hidden" }
              }
              animate={{
                height: "auto",
                opacity: 1,
                overflow: "visible",
              }}
              exit={
                isTopLevel
                  ? {}
                  : {
                      height: 0,
                      opacity: 0,
                      overflow: "hidden",
                    }
              }
              transition={{
                height: {
                  type: "spring",
                  stiffness: 400,
                  damping: 40,
                  mass: 1,
                },
                opacity: { duration: 0.25 },
              }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                exit={{ y: -10 }}
                transition={{ duration: 0.2 }}
                className="px-4 py-10 bg-white"
              >
                {children}
                {errors}
                {help}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
};

export default ToggleableFieldTemplate;
