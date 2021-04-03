/**
 * Metadata definition for pipes.
 */
export interface PipeMetadata<T = any> {
  /** Underlying base type (e.g `String`) of the parameter. */
  readonly metaType?: T;

  /** Query parameter key or route parameter name of the parameter. */
  readonly name?: string;
}

export interface PipeOptions {
  /* Determines whether field is nullable. */
  readonly nullable?: boolean;
}

export type ParameterPipe<TOutput, TMeta = unknown> = (
  value: any,
  metadata?: PipeMetadata<TMeta>
) => TOutput | undefined;
