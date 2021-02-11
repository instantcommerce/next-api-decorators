export interface PipeOptions {
  nullable?: boolean;
}

export type ParameterPipe<T> = (value: any, name?: string) => T;
