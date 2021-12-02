import React, { useEffect, useState } from "react";
import { TouchableOpacity, Dimensions } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { getLessonList, getSectionList } from "../axios/learnpress";
import axiosInstance from "../axios/orgin";
import LessonVideoPlayer from "../components/lessonVideoPlayer";

/**
 * @author
 * @function CourseSingle
 **/
export const CourseSingle = (props) => {
  const courseId = props.route.params.ID;
  const courseItitle = props.route.params.post_title || "Course Title";
  //   const courseId = 26535;
  //   const courseItitle = "Course Title";

  const [loading, setloading] = useState(true);
  const [sections, setsections] = useState([]);
  const [lessonsOfSection, setlessonsOfSection] = useState({});
  const [lessonPlayingStatus, setlessonPlayingStatus] = useState({});
  const [activeUris, setactiveUris] = useState();

  useEffect(() => {
    initialRunFunction(courseId);
    return () => {
      cleanupFunction();
    };
  }, [courseId]);

  const initialRunFunction = async (courseId) => {
    // console.log("Message from initialRunFunction");
    const sectionsArray = await getSectionList(courseId);
    setsections(sectionsArray);
    sectionsArray.forEach(async (section, sIndex) => {
      //   console.log("section", section);
      const lessonsArray = await getLessonList(section.section_id);
      //   console.log("lessonsArray", lessonsArray);
      setlessonsOfSection((oldV) => ({
        ...oldV,
        [section.section_id]: lessonsArray,
      }));
      if (sIndex === 0) {
        setactiveUris([
          lessonsArray[0].video_hd || '',
          lessonsArray[0].video_sd_h || '',
          lessonsArray[0].video_sd_l || '',
          lessonsArray[0].video_download_sd_m || '',
          lessonsArray[0].video_download_sd_l || '',
          lessonsArray[0].type || '',
          lessonsArray[0].doc || '',
        ]);
        setlessonPlayingStatus((oldV) => ({
          ...oldV,
          [lessonsArray[0].ID]: true,
        }));
      }
      setloading(false);
      //   console.log("lessonsArray", lessonsArray);
    });
  };

  const cleanupFunction = () => {
    console.log("Message from clianup Function");
  };

  const lessonClickedHandler = (lsn) => {
    const lsnID = lsn.ID;
    // console.log("clicked", lsn);
    let lessonPD = lessonPlayingStatus;
    Object.keys(lessonPD).forEach((v) => (lessonPD[v] = false));
    setlessonPlayingStatus(lessonPD);
    setlessonPlayingStatus((oldV) => ({ ...oldV, [lsnID]: true }));
    // console.log("changed LessonPD", lessonPlayingStatus);
    console.log("changing uris");
    setactiveUris([
      lsn.video_hd,
      lsn.video_sd_h,
      lsn.video_sd_l,
      lsn.video_download_sd_m,
      lsn.video_download_sd_l,
      lsn.type,
      lsn.doc,
    ]);
  };
  const LessonsView = (props) => {
    const sectionId = props.sectionId;
    const listOfLesson = lessonsOfSection[sectionId];
    try {
      return listOfLesson.map((lsn) => (
        <TouchableOpacity
          style={
            lessonPlayingStatus[lsn.ID] === true
              ? styles.buttonPlaying
              : styles.button
          }
          key={lsn.ID + Math.random()}
          onPress={() => lessonClickedHandler(lsn)}
        >
          <View>
            <Text>
              {lsn.post_title}
              {" #"}
              {lsn.ID}
            </Text>
          </View>
        </TouchableOpacity>
      ));
    } catch (error) {
      return (
        <View key={Math.random() + Math.random()}>
          <Text>{"Loading..."}</Text>
        </View>
      );
    }
  };

  //   const { container } = styles;
  return (
    <View style={styles.main}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          {activeUris[5] === "video" ? (
            <LessonVideoPlayer
              uris={{
                uris: activeUris,
              }}
            />
          ) : (
            <View
              style={{
                height: 300,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>
                {activeUris[6] !== ""
                  ? activeUris[6]
                  : "Document will be added soon"}
              </Text>
            </View>
          )}

          <Text style={styles.courseTitle}>{courseItitle}</Text>
        </View>
      )}
      <View style={styles.totalLessonContainer}>
        <ScrollView>
          <View>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <View style={styles.sectionContainer}>
                {0 ? (
                  <View>
                    <Text>dfghjk</Text>
                  </View>
                ) : (
                  <View>
                    {sections.map((sec) => (
                      <View key={sec.section_id.toString()}>
                        <Text style={styles.sectionTitle}>
                          {" "}
                          {sec.section_name} {" #"}
                          {sec.section_id.toString()}
                        </Text>
                        <View>
                          <LessonsView sectionId={sec.section_id} />
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const height = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    // display: "flex",
    flexDirection: "column",
    marginTop: -25,
  },
  courseTitle: {
    fontSize: 20,
    backgroundColor: "orange",
    height: 60,
  },
  totalLessonContainer: {
    height: height - 440,
  },
  lessonContainer: {
    // marginTop:5,
    marginBottom: 3,
  },
  sectionContainer: {
    // marginTop:5,
    marginBottom: 10,
  },
  sectionTitle: {
    backgroundColor: "gray",
    padding: 5,
    fontSize: 15,
  },
  button: {
    // alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    textAlign: "left",
    marginTop: 1,
    marginBottom: 1,
  },
  buttonPlaying: {
    // alignItems: "center",
    backgroundColor: "#AADDDD",
    padding: 10,
    textAlign: "left",
    marginTop: 1,
    marginBottom: 1,
  },
});
