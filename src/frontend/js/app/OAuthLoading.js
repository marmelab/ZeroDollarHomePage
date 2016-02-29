import React from 'react';
import Loading from './Loading';

export default () => (
    <div className="container-fluid">
        <div className="row">
            <div className="col-xs-12">
                <div className="jumbotron text-xs-center">
                    <p>Please wait while we check your github informations</p>
                    <p>
                        <Loading size="5x" />
                    </p>
                </div>
            </div>
        </div>
    </div>
);
