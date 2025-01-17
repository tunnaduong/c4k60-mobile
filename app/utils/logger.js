export default function Logger(props) {
  console.log(new Error().stack, `${props.label} rendered `);
  return null; // what is returned here is irrelevant...
}
