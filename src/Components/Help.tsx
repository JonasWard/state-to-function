import React from 'react';
import './help.css';
import { useGlobalUIStore } from '../state/globalUIStore';
import {
  CalculatorOutlined,
  FormOutlined,
  FunctionOutlined,
  NumberOutlined,
  SignatureOutlined
} from '@ant-design/icons';
import { IconTitle } from './icon/IconTitle';

const NumericInputDefinition: React.FC = () => {
  return (
    <div>
      <IconTitle icon={<NumberOutlined />} title="Inputs" size="large" />
      <p>
        All <b>Inputs</b> have a symbol, this symbol is used to identify that input. Optionally you can add a subscript
        and a name. In the methods page you will be able to select these inputs as input variables. There are three
        types of inputs that you can choose from: <b>Constants</b>, <b>Integer</b> (without decimal), <b>Float</b>{' '}
        (decimal numbers)
      </p>
      <IconTitle icon="𝑐" title="Constants" size="middle" />
      <p>
        Constants are defined ones. Use them to represent values you need to use multiple times or might have to change
        in the future but are otherwise considered as constant. Typical examples could be <b>π</b> or <b>e</b> for
        example.
      </p>
      <IconTitle icon="ℤ | ℝ" title="Integers & Floats" size="middle" />
      <p>
        Integers & Floats are variables that are assumed to be able to change, though within a specific range. In the
        applet you will be able to set the precise value. In the inputs menu you define besides the minimum and maximum
        also the default value (standard value which will be used in the applet).
      </p>
    </div>
  );
};

const MethodDefinition: React.FC = () => {
  return (
    <div>
      <IconTitle icon={<FunctionOutlined />} title="Methods" size="large" />
      <p>
        The methods are the different formulas defined. Formulas are certain operations applied onto a given amount of
        variables. Variables can be hardcoded in-line <b>Constant</b>, defined <b>Inputs</b>, results of other{' '}
        <b>Method Output</b> or another <b>Method</b>. You can recognise (sub)methods by an outline surrounding it.
      </p>
      <IconTitle icon={<CalculatorOutlined />} title="Operations" size="middle" />
      <div className="icon-list">
        <b>+</b> addition
        <b>x</b> multiplication
      </div>
      <p style={{ margin: '12px 0' }}>
        The addition and multiplication need to have at least two variables but can have up to 8 variables. By clicking
        the plus and minus buttons at the end of the method, you can add or remove variables.
      </p>
      <div className="icon-list">
        <b>-</b> subtraction
        <b>÷</b> division
        <b>^</b> power
      </div>
      <p style={{ margin: '12px 0' }}>The subtraction, division, and power operations can only have two variables.</p>
      <div className="icon-list">
        <b>{'<'}</b> smaller than
        <b>{'>'}</b> greater than
        <b>=</b> equal
      </div>
      <p style={{ margin: '12px 0' }}>
        The greater than, smaller than, have four variables. The first and second variables are compared, the third
        variable will be returned if the result of the comparison is true, the fourth variable is returned when the
        result of the comparison is false.
      </p>
    </div>
  );
};

const AppletDefinition: React.FC = () => {
  return (
    <div>
      <IconTitle icon={<SignatureOutlined />} title="Applet" size="large" />
      <p>
        At the top of the apple the variable inputs (Integers & Floats) that you defined at the <b>Inputs</b> menu are
        shown. Unless you are loading a previous state (using url) the values will be the default values assigned in the
        <b>Inputs</b> menu. The minimum and maximum values of these inputs are also taken over from the <b>Inputs</b>{' '}
        menu.
      </p>
      <p>
        On the bottom of the applet the outputs of all the <b>Methods</b> are shown. In case there would be an invalid{' '}
        inputs or outpts, all the outputs will be shown as <b>NaN</b>.
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
      <SignatureOutlined />
      <p>
        The <b>Applet</b> page
      </p>
    </div>
    <IconTitle icon={<FormOutlined />} title="Definition" size="large" />
    <p>The definition page has two sub-parts</p>
    <div className="icon-list">
      <NumberOutlined />
      <b>Inputs</b>
      <FunctionOutlined />
      <b>Methods</b>
    </div>
    <NumericInputDefinition />
    <MethodDefinition />
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
      <AppletDefinition />
    </div>
  );
};
