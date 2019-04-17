import React, { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
}

const Layout: React.SFC<LayoutProps> = ({ children }) => (
  <div className="container">
    <div className="row">
      <div className="col">
        <div className="card mt-5">
          <div className="card-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Layout;
