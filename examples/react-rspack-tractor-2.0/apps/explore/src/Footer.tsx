import * as React from 'react';
import './css/Footer.css';

const Footer = () => {
  return (
    <footer className="e_Footer" data-boundary="explore">
      <div className="e_Footer__cutter">
        <div className="e_Footer__inner">
          <div className="e_Footer__initiative">
            <img
              src="https://blueprint.the-tractor.store/cdn/img/neulandlogo.svg"
              alt="neuland - Büro für Informatik"
              width="45"
              height="40"
            />
            <p>
              based on{' '}
              <a href="https://micro-frontends.org/tractor-store/" target="_blank">
                the tractor store 2.0
              </a>
              <br />a{' '}
              <a href="https://neuland-bfi.de" target="_blank">
                neuland
              </a>{' '}
              project
            </p>
          </div>

          <div className="e_Footer__credits">
            <h3>techstack</h3>
            <p>SPA, Module Federation, React, rspack, React Router</p>
            <p>
              build by <img src="https://cdn.prod.website-files.com/669061ee3adb95b628c3acda/6696ebc69ea29a3d91e74441_zephyr%20fav.svg" alt="Zephyr Cloud" width="14" height="14" />
              <a href="https://www.zephyr-cloud.io/" target="_blank">
                Zephyr Cloud
              </a>{' '}
              /{' '}
              <a href="https://github.com/ZephyrCloudIO/zephyr-examples/tree/main/examples/react-rspack-tractor-2.0" target="_blank">
                GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
