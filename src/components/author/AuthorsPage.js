import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthorList from "./AuthorList";
import { loadAuthors, deleteAuthor } from "../../redux/actions/authorActions";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";

function AuthorsPage(props) {
  const [filteredAuthor, setfilteredAuthor] = useState([]);

  const authors = useSelector((state) => state.authors);
  const loading = useSelector((state) => state.apiCallsInProgress > 0);

  const dispatch = useDispatch();

  function loadAuthorsHandle() {
    dispatch(loadAuthors()).then(() => {
      setfilteredAuthor(authors);
    }).catch((error) => {
      alert("Loading authors failed " + error);
    });
  }

  useEffect(() => {
    console.log("loaded authors are", authors);
    if (authors.length === 0) {
      console.log("keri", authors);

      loadAuthorsHandle();
    }
    else{
      setfilteredAuthor(authors);
    }
  }, [authors.length]);

  async function handleDeleteAuthor(author) {
    toast.success("Author Deleted");

    try {
      
      dispatch(deleteAuthor(author)).catch((error) => {
        toast.error("Deleteing authors failed " + error);
        loadAuthorsHandle();
      });
      // await this.props.actions.deleteCourse(author);
      
    } catch (error) {
      toast.error(`Author Delete Failed :: ${error}`);
    }

    //delete author

    //show toastr success/failed

    //update UI
  }

  function handleSearchInput(event) {
    // on change power

    console.log("authors : ",authors);
    console.log("search : ",event.target.value);
    var filtered_authors = authors.filter(author => author.name.toLowerCase().includes((event.target.value).toLowerCase()));

    setfilteredAuthor(filtered_authors);
    console.log("filtered authors : ",filtered_authors);
    // 
  }

  return (
    <div>
      <h2>Authors</h2>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <button
            style={{ marginBottom: 20 }}
            className="btn btn-primary add-course"
            // eslint-disable-next-line react/prop-types
            onClick={() => props.history.push("/author")}
          >
            Add Author
          </button>
          <button
            style={{ marginBottom: 20, float: "right" }}
            className="btn btn-secondary refresh page"
            onClick={() => loadAuthorsHandle()}
          >
            Refresh
          </button>

          {/* search bar */}
          <input type="text" className="form-control" placeholder="Search" onChange={handleSearchInput} />

          <AuthorList onDeleteClick={handleDeleteAuthor} authors={filteredAuthor} />
        </>
      )}
    </div>
  );
}

export default AuthorsPage;
