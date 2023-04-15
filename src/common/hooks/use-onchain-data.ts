import { useEffect, useState } from "react";
import { WENT_WRONG } from "../../consts/messages";

interface IUseOnChainDataResult {
  isLoaded: boolean;
  data: any;
  error?: string;
}
export const useOnChainData = (fn, deps: any[]): IUseOnChainDataResult => {
  const [data, setData] = useState<any>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await fn();
        setData(res);
      } catch (e: any) {
        console.error(e);
        setError(e && e.message ? e.message : WENT_WRONG);
      }
      setIsLoaded(true);
    }
    fetch();
  }, deps);
  return { error, isLoaded, data };
};
