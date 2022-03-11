import { request } from 'graphql-request';
import config from '@utils/config';
import { DEV_HTTP_NETWORK_URL, MATIC_NETWORK_URL } from '@constants/global.constants';
import {
  getAuctionsByIds,
  getGarmentsByIds,
  getGarmentsByDesignerId,
  getDesignersByIds,
  getAuctionsHistoryByIds,
  getAuctionContracts,
  getMaterialVS,
  getCollectionGroups,
  getDigitalaxGarmentNftV2GlobalStats,
  getModelCollectionGroups,
} from '@services/api/gql.queries.api.service';

class APIService {
  constructor() {
    this.url = DEV_HTTP_NETWORK_URL;
  }

  setUrl(url) {
    this.url = url;
  }

  async getAuctionsByIds(ids) {
    return request(this.url, getAuctionsByIds, { ids });
  }

  async getDesignersByIds(ids) {
    return request(this.url, getDesignersByIds, { ids });
  }

  async getGarmentsByIds(ids) {
    return request(this.url, getGarmentsByIds, { ids });
  }

  async getGarmentsByDesignerIds(ids) {
    return request(this.url, getGarmentsByDesignerId, { ids });
  }

  async getAuctionsHistoryByIds(ids) {
    return request(this.url, getAuctionsHistoryByIds, { ids });
  }

  async getAuctionContracts() {
    return request(this.url, getAuctionContracts);
  }

  async getGlobalStats() {
    return request(MATIC_NETWORK_URL, getDigitalaxGarmentNftV2GlobalStats);
  }

  async getEthRate() {
    return fetch(`${config.EXCHANGE_API}/simple/price?ids=ethereum&vs_currencies=usd`).then(
      (response) => response.json()
    );
  }

  async getMaterialVS() {
    return request(MATIC_NETWORK_URL, getMaterialVS);
  }

  async getCollectionGroups() {
    return request(MATIC_NETWORK_URL, getCollectionGroups);
  }

  async getModelCollectionGroups() {
    return request(MATIC_NETWORK_URL, getModelCollectionGroups);
  }
}

export default new APIService();
