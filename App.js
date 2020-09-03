import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import NumericInput from "react-native-numeric-input";
import { Table, Row, Rows, Col } from "react-native-table-component";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default class App extends React.PureComponent {
  isLogin = false;

  constructor(props) {
    // Where you initialize some data
    super(props);
    this.state = {
      data: "",
      tableHead: ["MovieName", "Rating"],
      userName: "",
      isLogin: false,
      movieName: "",
      rating: 0,
      newRating: 0,
      jwtToken: "",
      getFlag: false,
      refresh: false,
    };
  }

  login = () => {
    const val = this.state.userName;
    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);
    if (val.length == 0) {
      alert("Username cannot be empty");
      return false;
    } else if (pattern.test(val)) {
      alert("User name is not valid");
      return false;
    } else {
      try {
        fetch("http://192.168.0.45:8080/api/v1/login", {
          method: "POST",
          body: JSON.stringify({
            username: val,
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
          .then((resp) => resp.json())
          .then((value) => {
            this.state.isLogin = true;
            this.setState({ jwtToken: value.token });
            console.log("Login JWT Token :" + value.token);
          });
      } catch (e) {
        console.log(e);
        console.log("----------------------------");
      }
      alert("Login Successful");
      // document.getElementById("login").style.display = "None";
      return false;
    }
  };

  createFilm = () => {
    var movie = this.state.movieName;
    var rating = this.state.rating;
    var jwtToken = this.state.jwtToken;
    if (movie && movie.length == 0) {
      alert("Movie name cannot be empty");
      return false;
    } else if (rating && rating.length == 0) {
      alert("Rating cannot be empty");
    } else if (rating < 0 || rating > 5) {
      alert("Rating must be between '0' and '5'");
    } else {
      try {
        fetch("http://192.168.0.45:8080/api/v1/films", {
          method: "POST",
          body: JSON.stringify({
            name: movie,
            rating: rating,
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        }).then((resp) => {
          setTimeout(function () {
            if (resp.status == 200) {
              // document.getElementById("name").value = "";
              // document.getElementById("rating").value = "";

              alert("success");
            } else {
              alert(resp.status + ": " + resp.statusText);
            }
          }, 0);
        });
      } catch (e) {
        console.log(e);
        console.log("------------------");
      }
      // movies.push(movie)
      // console.log(movies);
      this.setState({ movieName: "" });
      return false;
    }
  };

  getFilms = () => {
    var data = [];
    // var table = document.getElementById("mytable");
    // for (var i = table.rows.length - 1; i > 0; i--) {
    //   table.deleteRow(i);
    // }
    try {
      fetch("http://192.168.0.45:8080/api/v1/films", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((results) => {
          results.forEach((item) => {
            data.push([item._id, item.name, item.rating]);
            console.log(data);
          });
          this.setState({ data: data });
          this.setState({ getFlag: true });
        });
      // console.log("Data ", data);
    } catch (e) {
      console.log(e);
      console.log("-------------------");
    }
    return false;
  };

  editFilms = (index) => {
    // const { refresh, data } = this.state;
    // console.log(this.state.data[0]);
    const data = [...this.state.data];
    data[index].push(true); //[sye, 4, true]
    this.setState({
      data,
    });
    console.log("after", data[0]);
  };

  saveFilms = (index) => {
    // var row = document.getElementById(id);
    // var ratingId = "rating" + id;
    // var rating = document.getElementById(ratingId).value;
    const data = [...this.state.data];
    var rat = this.state.newRating;
    id = data[index][0];
    var jwtToken = this.state.jwtToken;
    console.log("updated Data: ", data[index]);
    console.log("new Rating" + rat);

    if (rat.length == 0) {
      alert("Rating cannot be empty");
    } else if (rat < 0 || rat > 5) {
      alert("Rating must be between '0' and '5'");
    } else {
      try {
        fetch("http://192.168.0.45:8080/api/v1/films", {
          method: "PUT",
          body: JSON.stringify({
            id: id,
            rating: rat,
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        }).then((resp) => {
          setTimeout(function () {
            if (resp.status == 200) {
              alert("success");
            } else {
              alert(resp.status + ": " + resp.statusText);
            }
          }, 0);
        });
      } catch (e) {
        console.log(e);
        console.log("------------------");
      }

      this.getFilms();
      // movies.push(movie)
      // console.log(movies);

      return false;
    }
  };

  loginElements = () => {
    var state = this.state;
    const { data } = this.state;
    return (
      <View>
        <View style={styles.login}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={(text) => this.setState({ userName: text })}
          />
          <View style={styles.userBtn}>
            <Button color="orange" title="Login" onPress={this.login} />
          </View>
          <View style={styles.userBtn}>
            <Button
              color="orange"
              title="Fetch Movie"
              onPress={this.getFilms}
            />
          </View>
        </View>
        <View>
          <ScrollView vertical={true}>
            {this.state.getFlag && (
              <View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Text style={styles.name}>Movie Name</Text>
                  <Text style={styles.name}>Rating</Text>
                  <Text style={styles.name}>Mode</Text>
                </View>
                {this.state.data.map((movie, index) => {
                  return (
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.tableMovie}>{data[index][1]}</Text>
                      {!data[index][3] && (
                        <Text style={styles.tableRating}>{data[index][2]}</Text>
                      )}
                      {data[index][3] && (
                        <View style={styles.tableRatingInput}>
                          <TextInput
                            onChangeText={(value) =>
                              this.setState({ newRating: value })
                            }
                          />
                        </View>
                      )}
                      {!data[index][3] && (
                        <Button
                          color="orange"
                          title="Edit"
                          style={styles.userBtn}
                          onPress={() => this.editFilms(index)}
                          key={index}
                        />
                      )}
                      {data[index][3] && (
                        <Button
                          color="orange"
                          title="Save"
                          style={styles.userBtn}
                          onPress={() => this.saveFilms(index)}
                          key={index}
                        />
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    );
  };

  moviesScreen = () => {
    const { data } = this.state;
    console.log("********", this.state.data);
    console.log("New rating", this.state.newRating);
    return (
      <View>
        <View style={styles.login}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={styles.name}> Movie Name</Text>
            <TextInput
              style={styles.movieInput}
              clearButtonMode="always"
              onChangeText={(text) => this.setState({ movieName: text })}
            />
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={styles.rating}> Rating </Text>
            <View style={styles.ratingInput}>
              <NumericInput
                iconSize={3}
                clearButtonMode="always"
                onChange={(value) => this.setState({ rating: value })}
              />
            </View>
          </View>

          <View>
            <View style={styles.userBtn}>
              <Button
                color="orange"
                title="Add Movie"
                onPress={this.createFilm}
              />
            </View>
            <View style={styles.userBtn}>
              <Button
                color="orange"
                title="Fetch Movie"
                onPress={this.getFilms}
              />
            </View>
          </View>
        </View>
        <View>
          <ScrollView vertical={true}>
            {this.state.getFlag && (
              <View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Text style={styles.name}>Movie Name</Text>
                  <Text style={styles.name}>Rating</Text>
                  <Text style={styles.name}>Mode</Text>
                </View>
                {this.state.data.map((movie, index) => {
                  return (
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.tableMovie}>{data[index][1]}</Text>
                      {!data[index][3] && (
                        <Text style={styles.tableRating}>{data[index][2]}</Text>
                      )}
                      {data[index][3] && (
                        <View style={styles.tableRatingInput}>
                          <TextInput
                            onChangeText={(value) =>
                              this.setState({ newRating: value })
                            }
                          />
                        </View>
                      )}
                      {!data[index][3] && (
                        <Button
                          color="orange"
                          title="Edit"
                          style={styles.userBtn}
                          onPress={() => this.editFilms(index)}
                          key={index}
                        />
                      )}
                      {data[index][3] && (
                        <Button
                          color="orange"
                          title="Save"
                          style={styles.userBtn}
                          onPress={() => this.saveFilms(index)}
                          key={index}
                        />
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    );
  };

  render() {
    // console.log(this.state.data);
    console.log("text", this.state.isLogin);
    console.log("User name:", this.state.userName);
    console.log("Movie Name: ", this.state.movieName);
    console.log("JWT", this.state.jwtToken);
    console.log("data", this.state.data[0]);

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Movies</Text>
        {!this.state.isLogin ? this.loginElements() : this.moviesScreen()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "dodgerblue",
  },
  login: {
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    margin: 10,
  },
  input: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
  },
  userBtn: {
    backgroundColor: "#FFFFFF",
    margin: 5,
  },
  name: {
    fontSize: 20,
    margin: 10,
  },
  movieInput: {
    width: "50%",
    backgroundColor: "#fff",
    marginLeft: 10,
    marginBottom: 10,
    marginTop: 10,
    padding: 5,
  },
  ratingInput: {
    padding: 5,
    fontSize: 10,
    marginRight: 10,
  },
  rating: {
    fontSize: 20,
    marginLeft: 10,
    marginTop: 10,
  },
  tableMovie: {
    fontSize: 15,
    color: "white",
    width: "25%",
    textAlign: "center",
    fontWeight: "bold",
  },
  tableRating: {
    fontSize: 15,
    textAlign: "center",
    color: "white",
    width: "10%",
    fontWeight: "bold",
  },
  tableRatingInput: {
    backgroundColor: "white",
    color: "black",
    width: "10%",
    textAlign: "center",
    alignContent: "center",
  },
});
