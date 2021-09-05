import React from "react";
import { connect } from "react-redux";
import * as courseActions from "../../redux/actions/courseActions";
import * as authorActions from "../../redux/actions/authorActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import CourseList from "./CourseList";
import { Redirect } from "react-router-dom";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";

class CoursesPage extends React.Component {
  state = {
    redirectToAddCoursePage: false,
    filtered_courses: [],
  };

  loadCoursePageContent = (forcefully = false) => {
    const { courses, authors, actions } = this.props;

    // console.log("props are ", this.props.courses);

    if (courses.length === 0 || forcefully) {
      actions
        .loadCourses()
        .then(() => {
          console.log("courses : ", this.props.courses);
          this.setState({ filtered_courses: this.props.courses });
        })
        .catch((error) => {
          alert("Loading courses failed " + error);
        });
    }

    if (authors.length === 0 || forcefully) {
      actions.loadAuthors().catch((error) => {
        alert("Loading authors failed " + error);
      });
    }
  }

  componentDidMount() {
    this.loadCoursePageContent();
  }

  handleDeleteCourse = async (course) => {
    toast.success("Course Deleted");
    try {
      await this.props.actions.deleteCourse(course);
    } catch (error) {
      toast.error(
        "Deleting " +
          course.title +
          " Course Failed. " +
          "Error is: " +
          error.message,
        { autoClose: false }
      );
      this.props.actions
        .loadCourses()
        .then(this.setState({ redirectToAddCoursePage: false }))

        .catch((error) => {
          alert("Loading courses failed " + error);
        });
    }
  };

  handleSearchInput = (event) => {
    const { courses } = this.props;

    console.log("courses : ", courses);
    console.log("search : ", event.target.value);
    var filtered_courses = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(event.target.value.toLowerCase()) ||
        course.authorName
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        course.category.toLowerCase().includes(event.target.value.toLowerCase())
    );

    this.setState({ filtered_courses: filtered_courses });
    console.log("filtered courses : ", filtered_courses);
    //
  };

  handleAuthorFilterSelect = (event) => {
    const { courses } = this.props;

    console.log("author filter selected : ", event.target.value);
    if (event.target.value === "all")
      return this.setState({ filtered_courses: this.props.courses });

    var filtered_courses = courses.filter((course) =>
      course.authorName.toLowerCase().includes(event.target.value.toLowerCase())
    );

    this.setState({ filtered_courses: filtered_courses });
    console.log("filtered courses : ", filtered_courses);
    //
  };

  render() {
    return (
      <>
        {this.state.redirectToAddCoursePage && <Redirect to="/course" />}
        <h2>Courses</h2>
        {this.props.loading ? (
          <Spinner />
        ) : (
          <>
            <button
              style={{ marginBottom: 20 }}
              className="btn btn-primary add-course"
              onClick={() => this.setState({ redirectToAddCoursePage: true })}
            >
              Add Course
            </button>

            <button
              style={{ marginBottom: 20, float: "right", marginLeft: 20 }}
              className="btn btn-secondary refresh page"
              onClick={() => this.loadCoursePageContent(true)}
            >
              Refresh
            </button>

            <select
              style={{ marginBottom: 20, float: "right", width: "fit-content" }}
              className="form-control add-course"
              onChange={this.handleAuthorFilterSelect}
            >
              <option value="all">All</option>
              {this.props.authors.map((author) => {
                return (
                  <option key={author.id} value={author.name}>
                    {author.name}
                  </option>
                );
              })}
            </select>

            {/* search bar */}
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              onChange={this.handleSearchInput}
            />

            <CourseList
              onDeleteClick={this.handleDeleteCourse}
              courses={this.state.filtered_courses}
            />
          </>
        )}
      </>
    );
  }
}

CoursesPage.propTypes = {
  actions: PropTypes.object.isRequired,
  courses: PropTypes.array.isRequired,
  authors: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    courses:
      state.authors.length === 0
        ? []
        : state.courses.map((course) => {
            return {
              ...course,
              authorName: state.authors.find((a) => a.id === course.authorId)
                .name,
            };
          }),
    authors: state.authors,
    loading: state.apiCallsInProgress > 0,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadCourses: bindActionCreators(courseActions.loadCourses, dispatch),
      loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
      deleteCourse: bindActionCreators(courseActions.deleteCourse, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
