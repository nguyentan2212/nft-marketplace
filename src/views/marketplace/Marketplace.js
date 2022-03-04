import React from 'react'
import useMarketplace from "../../hooks/useMarketplace";

function Marketplace() {
  const { marketplaceAddress } = useMarketplace();

  return (
    <div>Marketplace's address: { marketplaceAddress }</div>
  )
}

export default Marketplace;
