import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCurrentProfile } from "../../actions/profile";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../layouts/Spinner";
import { DashboardAction } from "./DashboardAction";

const Dashboard = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, []);
  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 class='large text-primary'>Dashboard</h1>
      <p class='lead'>
        <i class='fa fa-user'></i> Welcome {user.name}
      </p>
      {profile !== null ? (
        <Fragment>
          <DashboardAction />
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not created Profile yet , please add some info</p>
          <Link to='/create-profile' className='btn btn-primary my-1'>
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
