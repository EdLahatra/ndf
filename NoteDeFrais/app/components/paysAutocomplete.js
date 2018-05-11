import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  AlertIOS
} from 'react-native';

import AutoComplete from 'react-native-autocomplete';
import Countries from '../lib/countries.json';

const flag = code =>
  `https://raw.githubusercontent.com/hjnilsson/country-flags/master/png250px/${code}.png`;

const styles = StyleSheet.create({
  autocomplete: {
    alignSelf: 'stretch',
    height: 50,
    margin: 10,
    marginTop: 50,
    backgroundColor: '#FFF',
    borderColor: 'lightblue',
    borderWidth: 1
  },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'lightblue',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cellText: {
    flex: 1,
    marginLeft: 10
  },
  image: {
    width: 20,
    height: 20,
    marginLeft: 10
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  }
});

const CustomCell = ({ data }) => (
  <View style={styles.cell}>
    <Image source={{ uri: flag(data.code) }} style={styles.image} />
    <Text style={styles.cellText}>{data.country}</Text>
  </View>
);

export default class RCTAutoCompleteApp extends Component {
  state = { data: [] };

  constructor(props) {
    super(props);
    this.onTyping = this.onTyping.bind(this);
  }

  onTyping(text) {
    const countries = Countries.filter(country =>
      country.name.toLowerCase().startsWith(text.toLowerCase())
    ).map(country => ({ country: country.name, code: country.code.toLowerCase() }));

    this.setState({ data: countries });
  }

  onSelect(json) {
    AlertIOS.alert('You choosed', json.country);
  }

  render() {
    return (
      <View style={styles.container}>
        <AutoComplete
          style={styles.autocomplete}
          cellComponent={CustomCell}
          suggestions={this.state.data}
          onTyping={this.onTyping}
          onSelect={this.onSelect}
          placeholder="Search for a country"
          clearButtonMode="always"
          returnKeyType="go"
          textAlign="center"
          clearTextOnFocus
          autoCompleteTableTopOffset={10}
          autoCompleteTableLeftOffset={20}
          autoCompleteTableSizeOffset={-40}
          autoCompleteTableBorderColor="lightblue"
          autoCompleteTableBackgroundColor="azure"
          autoCompleteTableCornerRadius={8}
          autoCompleteTableBorderWidth={1}
          autoCompleteRowHeight={40}
          autoCompleteFetchRequestDelay={100}
          maximumNumberOfAutoCompleteRows={6}
        />
      </View>
    );
  }
}
