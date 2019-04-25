import React, { Component } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  SettingToggle,
  Stack,
  TextField,
  TextStyle,
  Heading,
  ResourceList,
  Tag
} from "@shopify/polaris";
import Apply from "./Apply";
import "./Find.css";

export class Find extends Component {
  state = {
    products: [],
    find: "",
    replace: "",
    filteredProducts: [],
    applying: false
  };

  componentWillMount() {
    this.setState({
      products: this.props.products
    });
  }

  render() {
    return (
      <Page fullWidth>
        {this.state.applying ? (
          <Apply changes={this.state.filteredProducts} />
        ) : (
          <Layout>
            <Layout.Section>
              <Layout.AnnotatedSection
                title="Find & Replace"
                description="Search product descriptions."
              >
                <Card sectioned>
                  <Form onSubmit={this.handleSubmit}>
                    <FormLayout>
                      <FormLayout.Group>
                        <TextField
                          value={this.state.find}
                          onChange={this.handleChange("find")}
                          label="Find"
                          type="find"
                        />
                        <TextField
                          value={this.state.replace}
                          onChange={this.handleChange("replace")}
                          label="Replace"
                          type="replace"
                        />
                      </FormLayout.Group>
                      <ButtonGroup>
                        <Button primary submit>
                          Preview
                        </Button>
                        {this.state.filteredProducts.length ? (
                          <Button
                            onClick={() => {
                              this.handleApply(this.state.filteredProducts);
                            }}
                          >
                            Apply
                          </Button>
                        ) : null}
                      </ButtonGroup>
                    </FormLayout>
                  </Form>
                </Card>
              </Layout.AnnotatedSection>
            </Layout.Section>
            <Layout.Section>
              <Card>
                {this.state.filteredProducts.length > 0 ? (
                  <ResourceList
                    resourceName={{ singular: "product", plural: "products" }}
                    items={this.state.filteredProducts}
                    renderItem={item => {
                      return (
                        <ResourceList.Item
                          id={item.node.id}
                          accessibilityLabel={`View details for ${
                            item.node.title
                          }`}
                        >
                          <h3>
                            <TextStyle variation="strong">
                              {item.node.title}
                            </TextStyle>
                          </h3>
                          <Layout>
                            <Layout.Section oneHalf>
                              <div>
                                <TextStyle variation="negative">
                                  Before
                                </TextStyle>
                                <div>{item.node.descriptionHtml}</div>
                              </div>
                            </Layout.Section>
                            <Layout.Section oneHalf>
                              <div>
                                <TextStyle variation="positive">
                                  After
                                </TextStyle>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: item.node.descriptionHtmlHighlight
                                  }}
                                />
                              </div>
                            </Layout.Section>
                          </Layout>
                        </ResourceList.Item>
                      );
                    }}
                  />
                ) : (
                  <ResourceList
                    items={["none"]}
                    renderItem={item => {
                      return (
                        <ResourceList.Item>
                          <h3>
                            <TextStyle variation="strong">No Results</TextStyle>
                          </h3>
                        </ResourceList.Item>
                      );
                    }}
                  />
                )}
              </Card>
            </Layout.Section>
          </Layout>
        )}
      </Page>
    );
  }
  handleSubmit = () => {
    let filteredProducts = this.state.products.filter(
      item => item.node.descriptionHtml.indexOf(this.state.find) !== -1
    );

    filteredProducts.forEach(item => {
      item.node.descriptionHtmlAfter = item.node.descriptionHtml
        .split(this.state.find)
        .join(this.state.replace);
      item.node.descriptionHtmlHighlight = item.node.descriptionHtml
        .split(this.state.find)
        .join(`<span class="highlight">${this.state.replace}<span>`);
    });

    this.setState({
      find: this.state.find,
      replace: this.state.replace,
      filteredProducts
    });
  };
  handleChange = field => {
    return value => this.setState({ [field]: value });
  };
  handleToggle = () => {
    this.setState(({ enabled }) => {
      return { enabled: !enabled };
    });
  };
  handleApply = changes => {
    this.setState({ applying: true });
  };
}

export default Find;
