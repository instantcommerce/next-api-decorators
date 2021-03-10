export interface PipeMetadata<T = any> {
  readonly metaType?: T;
  readonly name?: string;
}

export interface PipeOptions {
  readonly nullable?: boolean;
}

export type ParameterPipe<TOutput, TMeta = unknown> = (
  value: any,
  metadata?: PipeMetadata<TMeta>
) => TOutput | undefined;
