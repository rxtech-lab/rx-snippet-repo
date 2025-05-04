import React, { useState, useEffect, useMemo } from "react";
import { Dropdown, IDropdownOption } from "@fluentui/react";
import { WidgetProps } from "@rjsf/utils";

/**
 * JobsArraySelectorWidget is a custom widget for selecting multiple jobs by name
 * It's designed to work with the 'needs' array in the repository spec
 *
 * @param props - The widget props from React JSON Schema Form
 * @returns A multi-select dropdown component displaying available job names
 */
const JobsArraySelectorWidget = (props: WidgetProps) => {
  const { formData = [], onChange, registry, value, id } = props;

  // Local state to manage selected keys
  const [selectedKeys, setSelectedKeys] = useState<string[]>(value);

  // Update local state when formData changes
  useEffect(() => {}, [formData]);

  // Get the root form data to access all jobs
  const rootFormData = registry.formContext?.formData || {};

  // Extract job names from the jobs array
  const jobs = rootFormData.jobs || [];

  // split root_jobs_0_needs to get the jobId 0
  const jobId = parseInt(id?.split("_")[2] || "0");

  // Create dropdown options from job names using memoization
  const jobOptions = useMemo(() => {
    return jobs
      .map((job: any, index: number) => {
        // Make sure job has a name property
        if (!job || !job.name) return null;

        return {
          key: job.name,
          text: job.name,
          data: { index },
        };
      })
      .filter((option: IDropdownOption) => option?.data?.index !== jobId);
  }, [jobs, jobId]);

  // Handle dropdown selection change
  const handleChange = (
    _: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => {
    if (!option) return;

    const newSelectedKeys = [...selectedKeys];
    const optionKey = option.key as string;

    if (option.selected) {
      // Add the key if it's selected
      if (!newSelectedKeys.includes(optionKey)) {
        newSelectedKeys.push(optionKey);
      }
    } else {
      // Remove the key if it's unselected
      const index = newSelectedKeys.indexOf(optionKey);
      if (index !== -1) {
        newSelectedKeys.splice(index, 1);
      }
    }

    setSelectedKeys(newSelectedKeys);
    onChange(newSelectedKeys);
  };

  return (
    <Dropdown
      selectedKeys={selectedKeys}
      onChange={handleChange}
      placeholder="Select jobs"
      options={jobOptions}
      multiSelect
      styles={{ dropdown: { width: "100%" } }}
    />
  );
};

export default JobsArraySelectorWidget;
