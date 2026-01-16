export interface Project {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateProjectInput = Pick<Project, "name" | "color">;
export type UpdateProjectInput = Partial<Pick<Project, "name" | "color">>;
