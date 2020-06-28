import React, { Fragment } from "react";

export default function () {
  return (
    <Fragment>
      <span
        style={{
          width: "200px",
          height: "200px",
          margin: "auto",
          display: "block",
        }}
      >
        <i class='fa fa-spinner fa-pulse fa-3x fa-fw' aria-hidden='true'></i>
      </span>
    </Fragment>
  );
}
