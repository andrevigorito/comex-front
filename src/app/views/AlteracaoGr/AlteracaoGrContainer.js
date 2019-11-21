import React, { Component } from 'react';
import * as API from '../../helpers/apiHelper';
import AlteracaoGr from './AlteracaoGr';
import Detalhe from '../Detalhe';

class ProductContainer extends Component {
  state = {
    products: [],
    product: null,
    isLoading: false,
  };

  componentDidMount() {
    this.getProducts();
  }

  async getProduct(uuid) {
    const { data: product } = await API.APIget(`products/${uuid}`);

    if (product) this.setState({ product });
  }

  async getProducts() {
    this.setState({ isLoading: true });
    const { data: products } = await API.APIget(`products/alteracaoGr`);

    if (products) this.setState({ products });
    this.setState({ isLoading: false });
  }

  handleRemoveProduct = () => {
    this.setState({
      product: null,
    });
  };

  async handleDetail(uuid) {
    await this.getProduct(uuid);
  }

  async handleFilter(params) {
    this.setState({ isLoading: true });

    // const params = {
    //   produto: 'D12768664',
    // };
    const response = await API.APIget(`products/alteracaoGr`, { params });

    const products = response.data;

    

    if (products) this.setState({ products });
    this.setState({ isLoading: false });
  }

  render() {
    const { products, product, isLoading } = this.state;
    return (
      <div>
        {product ? (
          <Detalhe
            product={product}
            onRemoveProduct={this.handleRemoveProduct}
          />
        ) : (
          <AlteracaoGr
            products={products}
            isLoading={isLoading}
            onDetail={uuid => this.handleDetail(uuid)}
            onFilter={params => this.handleFilter(params)}
          />
        )}
      </div>
    );
  }
}

export default ProductContainer;
