/**
 * Logic Parser.
 * 
 * import ParseLogic from '@/Flow/ParseLogic';
 * <p>Data 1: {String(ParseLogic({ object: revisions[0] }))}</p>
 * or:
 * const result = ParseLogic({object: revisions[0]});
 */
import jsonLogic from 'json-logic-js';

export default function ParseLogic({ object }) {
    /**
     * Adds an operation in json-logic-js to match a regex.
     * @param {*} regex 
     * @param {*} value 
     * @returns {boolean} True if match, false if not.
     */
    const match = (regex, value) => {
        if (!(regex instanceof RegExp)) {
            regex = new RegExp(regex);
        }
        return regex.test(value)
    }
    jsonLogic.add_operation("match", match);

    /**
     * Example rule, to check that any revision marked as draft
     * has alphabetic chars, not numeric. This is widely used in the industry.
     */
    const rule = {
      "and": [
        { "==": [{ "var": "draft" }, true] },  // Check if draft is true
        { "match": [{ "var": "code" }, /^[A-Za-z]+$/]}  // Check if code is only alphabetic
      ]
    };    
      
  return jsonLogic.apply(rule, object)
}