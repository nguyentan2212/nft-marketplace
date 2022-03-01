import useMarketplace from "./useMarketplace.js";

function useApp() {
    const { marketplaceAddress } = useMarketplace();
    const hasMarketplace = true;
    const canSetProject = true;
    const AdminAddress = "admin";
    const isFetching = true;
    return { marketplaceAddress, hasMarketplace, canSetProject, AdminAddress, isFetching };
}

export default useApp;
