import { SurfaceCard } from '@/components/SurfaceCard/SurfaceCard';
import { deviceColors } from '@/styles/tokens.css';
import { Box, Grid, GridItem } from '@kadena/react-ui';
import classnames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { color, input, selected, wrapper } from './ColorForm.css';
import { StepProps } from './Registration';
import { animationVariants } from './animation';

export const ColorForm: FC<StepProps> = ({
  isVisible,
  defaultValues,
  updateFields,
  navigation,
  stepIndex,
}) => {
  const { handleSubmit, register, watch } = useForm({
    defaultValues: { color: defaultValues.color },
  });

  const selectedColor = watch('color');

  const onSubmit = (values: { color: string }) => {
    updateFields(values);
    navigation.next();
  };

  return (
    <motion.div
      animate={isVisible ? 'visible' : 'hidden'}
      variants={animationVariants}
    >
      <form
        id={`registration-form-${stepIndex}`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <SurfaceCard
          title="Color"
          description="This color helps you to identify this account. The color is only stored
        on your device and cannot been seen by others."
        >
          <Grid gap="md" className={wrapper}>
            {Object.entries(deviceColors).map(([description, colorHex]) => {
              return (
                <GridItem key={colorHex}>
                  <input
                    className={input}
                    {...register('color', {
                      onChange: (event) => {
                        updateFields({ color: event.target.value });
                      },
                    })}
                    type="radio"
                    value={colorHex}
                    id={`color-${colorHex}`}
                  />
                  <label
                    htmlFor={`color-${colorHex}`}
                    aria-label={`Color ${description}`}
                  >
                    <Box
                      className={classnames(color, {
                        selected: selectedColor === colorHex,
                      })}
                      style={{ backgroundColor: colorHex }}
                    >
                      {selectedColor === colorHex && (
                        <AnimatePresence>
                          <motion.div
                            initial={{ transform: 'scale(0)', opacity: 0 }}
                            animate={{ transform: 'scale(1)', opacity: 1 }}
                            transition={{ duration: 0.1 }}
                            className={selected}
                          />
                        </AnimatePresence>
                      )}
                    </Box>
                  </label>
                </GridItem>
              );
            })}
          </Grid>
        </SurfaceCard>
      </form>
    </motion.div>
  );
};
