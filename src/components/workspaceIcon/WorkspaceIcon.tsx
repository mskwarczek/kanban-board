import './WorkspaceIcon.scss';

interface WorkspaceIconInterface {
  name: string;
  classExtension?: string;
}

export const WorkspaceIcon = ({ name, classExtension = '' }: WorkspaceIconInterface) => {
  return (
    <div className={`workspace-icon ${classExtension}`}>
      {name.charAt(0)}
    </div>
  )
}
