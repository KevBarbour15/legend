declare module "@gsap/react" {
  import type gsap from "gsap";

  type ContextSafeFunc = <T extends (...args: never[]) => unknown>(
    func: T,
  ) => T;
  type ContextFunc = (
    context: gsap.Context,
    contextSafe?: ContextSafeFunc,
  ) => void | (() => void);

  interface ReactRef {
    current: unknown;
  }

  interface useGSAPReturn {
    context: gsap.Context;
    contextSafe: ContextSafeFunc;
  }

  interface useGSAPConfig {
    scope?: ReactRef | Element | string;
    dependencies?: unknown[];
    revertOnUpdate?: boolean;
  }

  export function useGSAP(
    func?: ContextFunc | useGSAPConfig,
    dependencies?: unknown[] | useGSAPConfig,
  ): useGSAPReturn;
}
