import { Button } from "../../../../components";

export const Package = () => {
  return (
    <div className="p-4 space-y-4 border rounded-b bg-light border-dark/20">
      <div className="grid grid-cols-3 gap-8 text-primary">
        {["Online Marketing", "Full Management", "Premium Management"].map((item, index) => (
          <div key={index} className="p-4 space-y-2 border-2 rounded bg-light border-dark/20">
            <h5 className="text-2xl font-semibold">{item}</h5>
            <p className="text-sm text-justify">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis, fuga reiciendis? Alias similique officia, fuga maiores non nam doloribus repellendus incidunt corrupti quas, placeat
              asperiores impedit aperiam ab cum esse totam minima aliquid sint? Aut reprehenderit non culpa asperiores numquam!
            </p>
            <Button className="btn-outline">Edit</Button>
          </div>
        ))}
      </div>
    </div>
  );
};
