import React from "react";
import { Dropdown, IDropdownOption } from "@fluentui/react";
import { WidgetProps } from "@rjsf/utils";

/**
 * JobSelectorWidget is a custom widget for selecting jobs by name from a dropdown
 * It's intended to be used for the 'needs' field in the repository spec
 *
 * @param props - The widget props from React JSON Schema Form
 * @returns A dropdown component displaying available job names
 */
const JobSelectorWidget = (props: WidgetProps) => {
  const { formData, onChange, registry, idSchema } = props;

  // Get the root form data to access all jobs
  const rootFormData = registry.formContext?.formData || {};

  // Extract job names from the jobs array
  const jobs = rootFormData.jobs || [];

  // Get current job index from the idSchema path
  // The idSchema for a field within a job would look like "root_jobs_0_needs"
  // We need to extract the "0" part
  let currentJobIndex: number | undefined;
  const idPath = idSchema?.$id || "";
  const matches = idPath.match(/root_jobs_(\d+)_/);
  if (matches && matches.length > 1) {
    currentJobIndex = parseInt(matches[1], 10);
  }

  // Create dropdown options from job names
  const jobOptions: IDropdownOption[] = jobs
    .map((job: any, index: number) => {
      // Make sure job has a name property
      if (!job || !job.name) return null;

      return {
        key: job.name,
        text: job.name,
        data: { index },
      };
    })
    .filter((option: IDropdownOption | null): option is IDropdownOption => {
      if (!option) return false;
      // Filter out the current job to prevent circular dependencies
      return option.data.index !== currentJobIndex;
    });

  // Log for debugging
  console.log("Job options (single):", jobOptions);
  console.log("Current form data (single):", formData);

  // Handle dropdown selection change
  const handleChange = (
    _: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => {
    if (option) {
      console.log("Selection changed (single):", option.key);
      onChange(option.key as string);
    }
  };

  return (
    <Dropdown
      selectedKey={formData}
      onChange={handleChange}
      placeholder="Select a job"
      options={jobOptions}
      styles={{ dropdown: { width: "100%" } }}
    />
  );
};

export default JobSelectorWidget;
