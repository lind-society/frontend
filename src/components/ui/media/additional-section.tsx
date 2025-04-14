import * as React from "react";

import { SectionField } from "./section-field";

import { Section } from "./types";

export const AdditionalSection = ({
  section,
  onFieldAdd,
  onFieldUpdate,
  onFieldDelete,
  onFieldReset,
  onRemoveImage,
  onUpdateImage,
}: {
  section: Section;
  onFieldAdd: (e: React.MouseEvent) => void;
  onFieldUpdate: (fieldId: string, fieldName: "name" | "description", value: string) => void;
  onFieldDelete: (e: React.MouseEvent, fieldId: string) => void;
  onFieldReset: (e: React.MouseEvent, fieldId: string) => void;
  onRemoveImage: (fieldId: string, imgIndex: number) => void;
  onUpdateImage: (e: React.ChangeEvent<HTMLInputElement>, fieldId: string) => void;
}) => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold">{section.title}</h2>
      <div className="space-y-6">
        {section.field.map((field) => (
          <React.Fragment key={field.id}>
            <SectionField
              field={field}
              sectionTitle={section.title}
              onNameChange={(value) => onFieldUpdate(field.id, "name", value)}
              onDescriptionChange={(value) => onFieldUpdate(field.id, "description", value)}
              onUpdateImage={(e) => onUpdateImage(e, field.id)}
              onRemoveImage={(imgIndex) => onRemoveImage(field.id, imgIndex)}
              onAdd={onFieldAdd}
              onReset={(e) => onFieldReset(e, field.id)}
              onDelete={(e) => onFieldDelete(e, field.id)}
              canDelete={section.field.length > 1}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
