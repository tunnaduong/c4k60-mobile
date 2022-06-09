export default function Logger(props) {
  console.log(`${props.label} rendered ${props.times} times`);
  return null; // what is returned here is irrelevant...
}
