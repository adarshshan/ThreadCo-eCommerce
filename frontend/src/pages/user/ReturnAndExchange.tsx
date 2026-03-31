import { useEffect } from "react";
import CustomButton from "../../components/Button";

const ReturnAndExchange = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background py-5 text-[var(--color-text-light)] px-[1rem] lg:px-[8rem] xl:px-[20rem]">
      <h3>Return & Exchange Policy</h3>

      <div className="flex flex-col gap-3 mb-5">
        <div className="border border-[var(--color-border)] p-3 rounded-lg">
          <h5>Returns are accepted for damaged products at no cost.</h5>
          <p>
            Please provide a proper unboxing video clearly showing the package,
            the opening process, and the damage.
          </p>
        </div>

        <div className="border border-[var(--color-border)] p-3 rounded-lg">
          <h5>Returns are not accepted for size-related issues.</h5>
          <p>
            Kindly ensure you select the correct size before placing your order.
          </p>
        </div>

        <div className="border border-[var(--color-border)] p-3 rounded-lg">
          <p>Product colors may slightly vary due to lighting conditions.</p>
          <h5>Returns will not be accepted for color variations.</h5>
        </div>

        <div className="border border-[var(--color-border)] p-3 rounded-lg">
          <p>
            Exchanges are available only if the issue is caused by our side.
          </p>
        </div>

        <div className="border border-[var(--color-border)] p-3 rounded-lg">
          <p>
            Refunds are provided for damaged or incorrect products delivered by
            us.
          </p>
        </div>
      </div>

      <p className="text-sm text-center">
        If you meet the above criteria, please fill out the request form. We are
        happy to assist you.
      </p>

      <div className="w-full flex justify-center">
        <CustomButton className="w-full lg:w-[18rem]">
          Send Request
        </CustomButton>
      </div>
    </div>
  );
};

export default ReturnAndExchange;
