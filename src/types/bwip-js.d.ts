declare module 'bwip-js' {
  export interface ToBufferOptions {
    bcid: string
    text: string
    scale?: number
    height?: number
    includetext?: boolean
    textxalign?: string
    backgroundcolor?: string
    paddingwidth?: number
    paddingheight?: number
    [key: string]: any
  }

  export function toBuffer(options: ToBufferOptions): Promise<Buffer>
}
