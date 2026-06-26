import Responser from '@responser';

declare global {
  declare namespace Express {
    export interface Response extends Omit<Responser, 'keys'> {}
  }
}

export {};
