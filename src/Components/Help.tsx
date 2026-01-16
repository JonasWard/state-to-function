import React from 'react';
import './help.css';
import { useGlobalUIStore } from '../state/globalUIStore';
import { CalculatorOutlined, FormOutlined, FunctionOutlined, NumberOutlined } from '@ant-design/icons';
import { IconTitle } from './icon/IconTitle';

const NumericInputDefinition: React.FC = () => {
  return (
    <div>
      <IconTitle icon={<NumberOutlined />} title="Inputs" size="large" />
      <p>
        All inputs have a symbol, optionally you can add a subscript and a name. In the methods page you will be able to
        select the correct input based on its symbol (and optional subscript). There are three types of inputs that you
        can choose from: <b>Hardcoded</b> constants, <b>Integer</b> (without decimal), <b>Float</b> (decimal numbers)
      </p>
      <IconTitle icon="𝑐" title="Hardcoded" size="large" />

      <p>
        Hardcoded inputs are constants that are not calculated. They are defined by a single value. Use them for values
        like <b>π</b>, <b>e</b> or whatever other recurring constants you might need in your calculations.
      </p>
      <IconTitle icon="ℤ | ℝ" title="Integers & Floats" size="large" />
      <p>
        Integers & Floats are variables. In the inputs you defined the minimum and maximum allowed values for these
        variables that will be able to be inputted in the applet. You are also expected to define a default value (the
        middel value) which is the value the apple will use by default.
      </p>
    </div>
  );
};

const MethodDefinition: React.FC = () => {
  return (
    <div>
      <IconTitle icon={<FunctionOutlined />} title="Methods" size="large" />
      <p>
        Methods are the formula. For each method you can define which operation should be used. For now addition{' '}
        <b>(+)</b>,subtraction <b>(x)</b>, multiplication <b>(-)</b>, division <b>(÷)</b>, power <b>(^)</b> greater than{' '}
        <b>({'<'})</b>,smaller than <b>({'>'})</b>, equal <b>(=)</b> are defined. Each method has to be assigned
        specific variables. These variables are either hardcoded in-line constants, previously defined Inputs, results
        of previous methods or even another (nested) method. Each individual method is indicated by an outline.
      </p>
      <p>
        The addition and multiplication need to have at least two variables but can be assigned up to 8 variables. By
        clicking the plus button at the end of the method.
      </p>
      <p>The subtraction, division, and power operations can only have two variables.</p>
      <p>
        The greater than, smaller than, have for variables. The first and second variables are compared, the third
        variable is the result if the comparison is true, the fourth variable is the result if the comparison is false.
      </p>
    </div>
  );
};

const AppletDefinition: React.FC = () => {
  return (
    <div>
      <IconTitle icon={<CalculatorOutlined />} title="Applet" size="large" />
      <p>
        The applet page shows the variable inputs defined under the Inputs. By default the values will be the default
        values assigned in the inputs but you can input any value within the range you have defined. The applet also
        displays the results of all the methods you have defined under the Methods.
      </p>
    </div>
  );
};

const DesktopDefinition: React.FC = () => (
  <>
    <p>The app is composed of two pages</p>
    <div className="icon-list">
      <FormOutlined />
      <p>
        The <b>Definition</b> page
      </p>
      <CalculatorOutlined />
      <p>
        The <b>Applet</b> page
      </p>
    </div>
    <IconTitle icon={<FormOutlined />} title="Definition" size="large" />
    <p>
      The definition page has two sub-parts
      <div className="icon-list">
        <NumberOutlined />
        <b>Inputs</b>
        <FunctionOutlined />
        <b>Methods</b>
      </div>
      <NumericInputDefinition />
      <MethodDefinition />
    </p>
  </>
);

const MobileDefinition: React.FC = () => (
  <>
    <p>The app is composed of three pages</p>
    <div className="icon-list">
      <NumberOutlined />
      <p>
        The <b>Inputs</b> page
      </p>
      <FunctionOutlined />
      <p>
        The <b>Methods</b> page
      </p>
      <CalculatorOutlined />
      <p>
        The <b>Applet</b> page
      </p>
    </div>
    <NumericInputDefinition />
    <MethodDefinition />
    <AppletDefinition />
  </>
);

export const Help: React.FC = () => {
  const isDesktop = useGlobalUIStore((s) => s.isDesktop);
  return (
    <div className="help-container">
      <h1>State-to-Function</h1>
      <p>
        This is a simple app that allows you to create excel-like formulas, visualise them as a little applet and store
        them in the browser url. No backend, no database, no tracking, no cookies, no ads, no nonsense. Simply bookmark
        the url to use it later again!
      </p>
      <h2>Quick Intro</h2>
      {isDesktop ? <DesktopDefinition /> : <MobileDefinition />}
    </div>
  );
};
