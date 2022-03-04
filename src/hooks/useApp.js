import useMarketplace from "./useMarketplace.js";
import { useMoralis } from "react-moralis";

function useApp() {
    const { marketplaceAddress } = useMarketplace();
    const { account } = useMoralis();
    const hasMarketplace = marketplaceAddress ? true : false;
    const canSetProject = true;
    const AdminAddress = account;
    const isFetching = true;
    return { marketplaceAddress, hasMarketplace, canSetProject, AdminAddress, isFetching };
}

export default useApp;
