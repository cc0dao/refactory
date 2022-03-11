import { gql } from 'graphql-request';

export const getLiveAuctions = gql`
  {
    digitalaxGarmentAuctions(first: 1000, where: { resulted_not_in: [true] }) {
      id
      reservePrice
      endTime
      startTime
      resulted
      topBidder {
        id
      }
      topBid
      lastBidTime
    }
  }
`;

export const getAuctionsByIds = gql`
  query getAuctionsByIds($ids: [ID!]) {
    digitalaxGarmentAuctions(first: 1000, where: { id_in: $ids }) {
      id
      reservePrice
      endTime
      startTime
      resulted
      topBidder {
        id
      }
      topBid
      lastBidTime
    }
  }
`;

export const getGarmentsByIds = gql`
  query getGarmentsByIds($ids: [ID!]) {
    digitalaxGarments(first: 1000, where: { id_in: $ids }) {
      id
      designer
      owner
      primarySalePrice
      tokenUri
      children {
        amount
        tokenUri
        id
      }
    }
  }
`;

export const getDesignersByIds = gql`
  query getDesignersByIds($ids: [ID!]) {
    digitalaxGarmentDesigners(first: 1000, where: { id_in: $ids }) {
      id
      garments {
        id
        tokenUri
      }
      listings {
        reservePrice
        startTime
        endTime
        resulted
        topBidder {
          id
        }
        topBid
        lastBidTime
      }
    }
  }
`;

export const getGarmentsByDesignerId = gql`
  query getGarmentsByDesignerId($ids: [Bytes!]) {
    digitalaxGarments(first: 1000, where: { designer_in: $ids }) {
      id
      designer
      owner
      primarySalePrice
      tokenUri
      children {
        amount
        tokenUri
        id
      }
    }
  }
`;

export const getAuctionsHistoryByIds = gql`
  query getAuctionsHistoryByIds($ids: [ID!]) {
    digitalaxGarmentAuctionHistories(first: 1000, where: { token_in: $ids }) {
      id
      eventName
      timestamp
      transactionHash
      bidder {
        id
      }
      value
      token {
        id
        owner
        primarySalePrice
        tokenUri
        children {
          id
          amount
          tokenUri
        }
      }
    }
  }
`;

export const getAuctionContracts = gql`
  {
    digitalaxAuctionContracts(first: 1000) {
      id
      minBidIncrement
      bidWithdrawalLockTime
      platformFee
      platformFeeRecipient
      totalSales
    }
  }
`;

export const getMaterialVS = gql`
  {
    digitalaxMaterialV2S(first: 1000) {
      id
      name
      image
      tokenUri
      animation
      description
      attributes {
        value
        type
      }
    }
  }
`;

export const getCollectionGroups = gql`
  query digitalaxCollectionGroups {
    digitalaxCollectionGroups(first: 100, skip: 2) {
      id
      auctions {
        id
        topBid
        designer {
          id
          name
          image
        }
        garment {
          id
          animation
          image
          name
        }
      }
      collections {
        id
        rarity
        garments(first: 1) {
          id
          animation
          image
          name
        }
        designer {
          id
          name
          image
        }
        valueSold
      }
    }
  }
`;

export const getModelCollectionGroups = gql`
  query digitalaxModelCollectionGroups {
    digitalaxModelCollectionGroups(first: 100) {
      id
      collections {
        id
        rarity
        garments(first: 1) {
          id
          animation
          image
          name
        }
        model {
          id
          name
          image
        }
        designer {
          id
          name
          image
        }
        valueSold
      }
    }
  }
`;

export const getDigitalaxGarmentNftV2GlobalStats = gql`
  query digitalaxGarmentNFTV2GlobalStats {
    digitalaxGarmentNFTV2GlobalStats(first: 1) {
      id
      monaPerEth
    }
  }
`;
