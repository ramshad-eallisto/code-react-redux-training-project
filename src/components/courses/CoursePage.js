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
    rowCount: -1,
    pagination: 1,
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
    this.setState({ pagination: 1 });
    console.log("filtered courses : ", filtered_courses);
    //
  };

  handleRowCountSelect = (event) => {
    this.setState({ rowCount: event.target.value });
    console.log("row count : ", event.target.value);
    //
  };

  InsideADiv = (props) => {
    console.log("props : ", props);
    const count = props.rows;
    const onset = parseInt((props.page - 1) * count);
    const offset = parseInt((props.page) * count);
    console.log("count : ", 0,"onset : ", onset,"offset : ", offset);
    var filtered_courses = props.children.props.courses;
    if (count > 0) {
      filtered_courses = props.children.props.courses.filter(function(item) {
        if (this.count >= this.onset && this.count < this.offset) {
          this.count++;
          return true;
        }
        this.count++;
        return false;
      }, {count: 0, onset: onset, offset: offset});
    }
    console.log("filtered_courses : ", filtered_courses);
    
    return (<div id="2525" >
      <CourseList
        onDeleteClick={props.children.props.onDeleteClick}
        courses={filtered_courses}
      />
    </div>);
  };

  handlePageButton = (page) => {
    console.log("page : ", page);
    this.setState({ pagination: page });
    //
  };

  pginationDiv = (props) => {
    console.log("props : ", props);

    const course_count = props.courses.length;
    const row_count = props.rows;
    var page_count = parseInt(course_count / row_count);
    if (parseInt(course_count % row_count) > 0) {
      page_count++;
    }

    if (row_count > 0) {
      var rows = [];
      for (let index = 1; index <= page_count; index++) {
        rows.push(<button
          key={index}
          style={{ marginBottom: 20, marginLeft: 20 }}
          className="btn"
          onClick={() => this.handlePageButton(index)}
        >
          {index}
        </button>);
      }

      console.log('course_count: ',course_count);
      console.log('row_count: ',row_count);
      console.log('page_count: ',page_count);
      console.log('rows: ',rows);
      
      return (<div id="252535" style={{ float: "right"}} >
        {rows.map((row) => {
          return (row)
        })}
      </div>);
    }

    return ('');
    
  };

  render() {
    return (
      <>
        {(this.props.courses.length === 0) ? (
          
          <div className="">

            <div className="carousel-caption">
              <img src="src\2002.i515.001_modern_students_flat_icons-13.jpg" className="h-50 w-50" alt=""/><br/>
              <button
                style={{ marginBottom: 20 }}
                className="btn btn-primary add-course"
                onClick={() => this.setState({ redirectToAddCoursePage: true })}
              >
                Add Course
              </button>

              <button
                style={{ marginBottom: 20, marginLeft: 20 }}
                className="btn btn-secondary refresh page"
                onClick={() => this.loadCoursePageContent(true)}
              >
                Refresh
              </button>
            </div>

          </div>
          
        ) : (
          <>
            {this.state.redirectToAddCoursePage && <Redirect to="/course" />}
            <h2>Courses - {this.props.courses.length}</h2>
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
                  style={{ marginBottom: 20, float: "right", width: "fit-content" , marginLeft: 20 }}
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

                <select
                  style={{ marginBottom: 20, float: "right", width: "fit-content" , marginLeft: 20 }}
                  className="form-control add-course"
                  onChange={this.handleRowCountSelect}
                >
                  <option value="-1">All Items</option>
                  <option value="5">5 Rows</option>
                  <option value="10">10 Rows</option>
                </select>

                {/* search bar */}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  onChange={this.handleSearchInput}
                />

                <this.InsideADiv page={this.state.pagination} rows={this.state.rowCount}>
                  <CourseList
                    onDeleteClick={this.handleDeleteCourse}
                    courses={this.state.filtered_courses}
                  />
                </this.InsideADiv>
                <this.pginationDiv courses={this.state.filtered_courses} rows={this.state.rowCount}/>
              </>
            )}
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
