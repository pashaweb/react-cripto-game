


export type ByCrypto = (
    totalValInUsd: number,
    totalValInCrypto: number,
    valueToTransferInUsd: number,
    priceInUsd: number,
    fee: number
) => {
    totalValInUsd: number,
    totalValInCrypto: number
}

export const byCrypto: ByCrypto = (
    totalValInUsd,
    totalValInCrypto,
    valueToTransferInUsd,
    priceInUsd,
    fee
) => { 
    let totalValInUsdAfterTransfer = totalValInUsd - valueToTransferInUsd - (valueToTransferInUsd * fee);
    if (totalValInUsdAfterTransfer < 0) {
        valueToTransferInUsd = totalValInUsd - (totalValInUsd * fee);
        totalValInUsdAfterTransfer = 0;
    }
    
    const totalValInCryptoAfterTransfer = totalValInCrypto + (valueToTransferInUsd / priceInUsd) ;
    return {
        totalValInUsd: totalValInUsdAfterTransfer,
        totalValInCrypto: totalValInCryptoAfterTransfer
    }
}

type ByUsd = (
    totalValInUsd: number,
    totalValInCrypto: number,
    valueToTransferInUsd: number,
    priceInUsd: number,
    fee: number
) =>
{
    totalValInUsd: number,
    totalValInCrypto: number
    }

export const byUsd: ByUsd = (totalValInUsd,
    totalValInCrypto,
    valueToTransferInUsd,
    priceInUsd,
    fee) => {
    let totalValInCryptoAfterTransfer = totalValInCrypto - (valueToTransferInUsd / priceInUsd);
    if (totalValInCryptoAfterTransfer < 0) {
        valueToTransferInUsd = totalValInCrypto * priceInUsd;
        totalValInCryptoAfterTransfer = 0;
    }
    const totalValInUsdAfterTransfer = totalValInUsd + valueToTransferInUsd - (valueToTransferInUsd * fee);

    return {
        totalValInUsd: totalValInUsdAfterTransfer,
        totalValInCrypto: totalValInCryptoAfterTransfer
    }
}


