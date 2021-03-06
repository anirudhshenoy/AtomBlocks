
var BLOCKLY_TOOLBOX_XML = BLOCKLY_TOOLBOX_XML || Object.create(null);

/* BEGINNING BLOCKLY_TOOLBOX_XML ASSIGNMENT. DO NOT EDIT. USE BLOCKLY DEVTOOLS. */
BLOCKLY_TOOLBOX_XML['standard'] =
// From XML string/file, replace ^\s?(\s*)?(<.*>)$ with \+$1'$2'
// Tweak first and last line.

<xml id="toolbox-categories" style="display: none">
            <category name="Logic" colour="210" iconclass="blocklyTreeIconCustom logic">
              <label text="Logic" web-icon="" web-class="blocklyFlyoutHeading"></label>
              <block type="controls_if">
                <value name="IF0">
                  <shadow type="logic_boolean">
                  </shadow>
                </value>
              </block>
              <block type="controls_if">
                <mutation else="1"></mutation>
                <value name="IF0">
                  <shadow type="logic_boolean">
                  </shadow>
                </value>
              </block>
              <block type="logic_compare">
                <value name="A">
                  <shadow type="math_number">
                    <field name="NUM">10</field>
                  </shadow>
                </value>
                <value name="B">
                  <shadow type="math_number">
                    <field name="NUM">10</field>
                  </shadow>
                </value>
              </block>
              <block type="logic_operation"></block>
              <block type="logic_negate"></block>
              <block type="logic_boolean"></block>
              <block type="logic_null" disabled="true"></block>
              <block type="logic_ternary"></block>
            </category>
            <category name="Loops" colour="120" iconclass="blocklyTreeIconCustom loops">
              <label text="Loops" web-icon="" web-class="blocklyFlyoutHeading"></label>
              <label text="Basic" web-line="1.0"></label>
              <block type="controls_repeat_ext">
                <value name="TIMES">
                  <shadow type="math_number">
                    <field name="NUM">10</field>
                  </shadow>
                </value>
              </block>
              <block type="controls_repeat" disabled="true"></block>
              <block type="controls_whileUntil" disabled="true"></block>
              <label text="Advanced" web-line="1.0"></label>
              <block type="controls_for">
                <value name="VAR">
                  <shadow type="variables_get_reporter">
                    <field name="VAR">index</field>
                  </shadow>
                </value>
                <value name="FROM">
                  <shadow type="math_arithmetic">
                    <value name="A">
                      <shadow type="math_number">
                        <field name="NUM">1</field>
                      </shadow>
                    </value>
                    <value name="B">
                      <shadow type="math_number">
                        <field name="NUM">1</field>
                      </shadow>
                    </value>
                  </shadow>
                </value>
                <value name="TO">
                  <shadow type="math_number">
                    <field name="NUM">10</field>
                  </shadow>
                </value>
                <value name="BY">
                  <shadow type="math_number">
                    <field name="NUM">1</field>
                  </shadow>
                </value>
              </block>
              <block type="controls_forEach">
                <value name="VAR">
                  <shadow type="variables_get_reporter">
                    <field name="VAR">item</field>
                  </shadow>
                </value>
              </block>
              <block type="controls_flow_statements"></block>
            </category>
            <category name="Math" colour="230" iconclass="blocklyTreeIconCustom math">
              <label text="Math" web-icon="" web-class="blocklyFlyoutHeading"></label>
              <block type="math_number" gap="32">
                <field name="NUM">123</field>
              </block>
              <block type="math_number_minmax" gap="32">
                <mutation min="0" max="100"></mutation>
              </block>
              <label text="Arithmetic" web-line="0.0"></label>
              <block type="math_arithmetic">
                <value name="A">
                  <shadow type="math_number">
                    <field name="NUM">1</field>
                  </shadow>
                </value>
                <value name="B">
                  <shadow type="math_number">
                    <field name="NUM">1</field>
                  </shadow>
                </value>
              </block>
              <block type="math_single">
                <value name="NUM">
                  <shadow type="math_number">
                    <field name="NUM">9</field>
                  </shadow>
                </value>
              </block>
              <block type="math_trig">
                <value name="NUM">
                  <shadow type="math_number">
                    <field name="NUM">45</field>
                  </shadow>
                </value>
              </block>
              <block type="math_constant"></block>
              <block type="math_number_property">
                <value name="NUMBER_TO_CHECK">
                  <shadow type="math_number">
                    <field name="NUM">0</field>
                  </shadow>
                </value>
              </block>
              <label text="Advanced" web-line="2.0" web-line-width="200"></label>
              <block type="math_round">
                <value name="NUM">
                  <shadow type="math_number">
                    <field name="NUM">3.1</field>
                  </shadow>
                </value>
              </block>
              <block type="math_on_list"></block>
              <block type="math_modulo">
                <value name="DIVIDEND">
                  <shadow type="math_number">
                    <field name="NUM">64</field>
                  </shadow>
                </value>
                <value name="DIVISOR">
                  <shadow type="math_number">
                    <field name="NUM">10</field>
                  </shadow>
                </value>
              </block>
              <block type="math_constrain">
                <value name="VALUE">
                  <shadow type="math_number">
                    <field name="NUM">50</field>
                  </shadow>
                </value>
                <value name="LOW">
                  <shadow type="math_number">
                    <field name="NUM">1</field>
                  </shadow>
                </value>
                <value name="HIGH">
                  <shadow type="math_number">
                    <field name="NUM">100</field>
                  </shadow>
                </value>
              </block>
              <label text="Random" web-line="4.0"></label>
              <block type="math_random_int">
                <value name="FROM">
                  <shadow type="math_number">
                    <field name="NUM">1</field>
                  </shadow>
                </value>
                <value name="TO">
                  <shadow type="math_number">
                    <field name="NUM">100</field>
                  </shadow>
                </value>
              </block>
              <block type="math_random_float"></block>
            </category>
            <category name="Text" colour="160" iconclass="blocklyTreeIconCustom text">
              <label text="Text" web-icon="" web-class="blocklyFlyoutHeading"></label>
              <block type="text"></block>
              <block type="text_join"></block>
              <!--<block type="text_append">
                <value name="TEXT">
                  <shadow type="text"></shadow>
                </value>
              </block>-->
              <block type="text_length">
                <value name="VALUE">
                  <shadow type="text">
                    <field name="TEXT">abc</field>
                  </shadow>
                </value>
              </block>
              <block type="text_isEmpty">
                <value name="VALUE">
                  <shadow type="text">
                    <field name="TEXT"></field>
                  </shadow>
                </value>
              </block>
              <block type="text_indexOf">
                <value name="VALUE">
                  <block type="variables_get">
                    <field name="VAR">text</field>
                  </block>
                </value>
                <value name="FIND">
                  <shadow type="text">
                    <field name="TEXT">abc</field>
                  </shadow>
                </value>
              </block>
              <label text="Group with help" web-help-button="true" callbackkey="GROUP_HELP" web-line="1.0"></label>
              <block type="text_charAt">
                <value name="VALUE">
                  <block type="variables_get">
                    <field name="VAR">text</field>
                  </block>
                </value>
              </block>
              <block type="text_getSubstring">
                <value name="STRING">
                  <block type="variables_get">
                    <field name="VAR">text</field>
                  </block>
                </value>
              </block>
              <block type="text_changeCase">
                <value name="TEXT">
                  <shadow type="text">
                    <field name="TEXT">abc</field>
                  </shadow>
                </value>
              </block>
              <block type="text_trim">
                <value name="TEXT">
                  <shadow type="text">
                    <field name="TEXT">abc</field>
                  </shadow>
                </value>
              </block>
              <block type="text_count">
                <value name="SUB">
                  <shadow type="text"></shadow>
                </value>
                <value name="TEXT">
                  <shadow type="text"></shadow>
                </value>
              </block>
              <block type="text_replace">
                <value name="FROM">
                  <shadow type="text"></shadow>
                </value>
                <value name="TO">
                  <shadow type="text"></shadow>
                </value>
                <value name="TEXT">
                  <shadow type="text"></shadow>
                </value>
              </block>
              <block type="text_reverse">
                <value name="TEXT">
                  <shadow type="text"></shadow>
                </value>
              </block>
              <label text="Input/Output:" web-class="ioLabel"></label>
              <block type="text_print">
                <value name="TEXT">
                  <shadow type="text">
                    <field name="TEXT">abc</field>
                  </shadow>
                </value>
              </block>
              <block type="text_prompt_ext">
                <value name="TEXT">
                  <shadow type="text">
                    <field name="TEXT">abc</field>
                  </shadow>
                </value>
              </block>
            </category>
            <category name="Lists" colour="260" iconclass="blocklyTreeIconCustom lists">
              <label text="Lists" web-icon="" web-class="blocklyFlyoutHeading"></label>
              <block type="lists_create_with">
                <mutation items="0" type="math_number"></mutation>
              </block>
              <block type="lists_create_with">
                <mutation items="3" type="text"></mutation>
                <value name="ADD0">
                  <shadow type="math_number">
                    <field name="NUM">1</field>
                  </shadow>
                </value>
                <value name="ADD1">
                  <shadow type="math_number">
                    <field name="NUM">2</field>
                  </shadow>
                </value>
                <value name="ADD2">
                  <shadow type="math_number">
                    <field name="NUM">3</field>
                  </shadow>
                </value>
              </block>
              <block type="lists_create_with">
                <mutation items="2" type="text"></mutation>
                <value name="ADD0">
                  <shadow type="text">
                    <field name="TEXT">Hello</field>
                  </shadow>
                </value>
                <value name="ADD1">
                  <shadow type="text">
                    <field name="TEXT">World</field>
                  </shadow>
                </value>
              </block>
              <block type="lists_repeat">
                <value name="NUM">
                  <shadow type="math_number">
                    <field name="NUM">5</field>
                  </shadow>
                </value>
              </block>
              <block type="lists_length"></block>
              <block type="lists_isEmpty"></block>
              <block type="lists_indexOf"></block>
              <block type="lists_getIndex"></block>
              <block type="lists_setIndex"></block>
              <block type="lists_getSublist"></block>
              <block type="lists_split">
                <value name="DELIM">
                  <shadow type="text">
                    <field name="TEXT">,</field>
                  </shadow>
                </value>
              </block>
              <block type="lists_sort"></block>
              <block type="lists_reverse"></block>
            </category>
            <category name="Colour" colour="20" iconclass="blocklyTreeIconCustom colour">
              <label text="Colour" web-icon="" web-class="blocklyFlyoutHeading"></label>
              <block type="colour_picker"></block>
              <block type="colour_random"></block>
              <block type="colour_rgb">
                <value name="RED">
                  <shadow type="math_number">
                    <field name="NUM">100</field>
                  </shadow>
                </value>
                <value name="GREEN">
                  <shadow type="math_number">
                    <field name="NUM">50</field>
                  </shadow>
                </value>
                <value name="BLUE">
                  <shadow type="math_number">
                    <field name="NUM">0</field>
                  </shadow>
                </value>
              </block>
              <block type="colour_blend">
                <value name="COLOUR1">
                  <shadow type="colour_picker">
                    <field name="COLOUR">#ff0000</field>
                  </shadow>
                </value>
                <value name="COLOUR2">
                  <shadow type="colour_picker">
                    <field name="COLOUR">#3333ff</field>
                  </shadow>
                </value>
                <value name="RATIO">
                  <shadow type="math_number">
                    <field name="NUM">0.5</field>
                  </shadow>
                </value>
              </block>
            </category>
            <sep></sep>
            <category name="Variables" colour="330" custom="VARIABLE" iconclass="blocklyTreeIconCustom variables"></category>
            <category name="Functions" colour="290" custom="PROCEDURE" iconclass="blocklyTreeIconCustom functions"></category>
          </xml>

/* END BLOCKLY_TOOLBOX_XML ASSIGNMENT. DO NOT EDIT. */
